const { initAuthCreds, BufferJSON } = require('@whiskeysockets/baileys');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in the environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);
const TABLE_NAME = 'wa_auth_state';

/**
 * Custom auth store for Baileys backed by Supabase
 */
async function useSupabaseAuthState() {
    // Read a specific key from Supabase
    const readData = async (key) => {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select('data')
                .eq('key', key)
                .single();

            if (error || !data) return null;
            return JSON.parse(data.data, BufferJSON.reviver);
        } catch (error) {
            console.error(`Error reading ${key} from Supabase:`, error);
            return null;
        }
    };

    // Write a specific key to Supabase
    const writeData = async (key, data) => {
        try {
            const strData = JSON.stringify(data, BufferJSON.replacer);
            const { error } = await supabase
                .from(TABLE_NAME)
                .upsert({
                    key: key,
                    data: strData,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'key' });

            if (error) {
                console.error(`Error writing ${key} to Supabase:`, error);
            }
        } catch (error) {
            console.error(`Error writing ${key} to Supabase:`, error);
        }
    };

    // Remove a specific key from Supabase
    const removeData = async (key) => {
        try {
            const { error } = await supabase
                .from(TABLE_NAME)
                .delete()
                .eq('key', key);

            if (error) {
                console.error(`Error removing ${key} from Supabase:`, error);
            }
        } catch (error) {
            console.error(`Error removing ${key} from Supabase:`, error);
        }
    };

    // Load initial creds
    let creds = await readData('creds');
    if (!creds) {
        creds = initAuthCreds();
        await writeData('creds', creds);
    }

    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(
                        ids.map(async (id) => {
                            let value = await readData(`${type}-${id}`);
                            if (type === 'app-state-sync-key' && value) {
                                value = Buffer.from(value.data || value, 'base64');
                            }
                            data[id] = value;
                        })
                    );
                    return data;
                },
                set: async (data) => {
                    const tasks = [];
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            const key = `${category}-${id}`;
                            if (value) {
                                tasks.push(writeData(key, value));
                            } else {
                                tasks.push(removeData(key));
                            }
                        }
                    }
                    await Promise.all(tasks);
                }
            }
        },
        saveCreds: () => writeData('creds', creds)
    };
}

module.exports = { useSupabaseAuthState };
