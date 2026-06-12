from dotenv import load_dotenv
load_dotenv()

from scheduler import check_and_notify

if __name__ == "__main__":
    print("Running manual check for wishes...")
    check_and_notify()
    print("Finished.")
