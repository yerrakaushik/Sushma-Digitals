"""
Cloudinary upload/delete helpers for wish media.
"""
import os
import logging
import cloudinary
import cloudinary.uploader

log = logging.getLogger(__name__)


def _configure():
    cloudinary.config(
        cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
        api_key=os.environ.get("CLOUDINARY_API_KEY"),
        api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
        secure=True,
    )


def upload_media(file_bytes: bytes, filename: str, resource_type: str = "auto") -> dict:
    """
    Upload bytes to Cloudinary.
    Returns dict with 'url' and 'public_id'.
    """
    _configure()
    try:
        result = cloudinary.uploader.upload(
            file_bytes,
            folder="sushma_digitals/wishes",
            public_id=filename,
            resource_type=resource_type,
            overwrite=True,
        )
        return {"url": result["secure_url"], "public_id": result["public_id"]}
    except Exception as e:
        log.error(f"[Cloudinary] Upload failed: {e}")
        raise


def delete_media(public_id: str, resource_type: str = "image") -> bool:
    """Delete a Cloudinary asset by public_id."""
    _configure()
    try:
        cloudinary.uploader.destroy(public_id, resource_type=resource_type)
        return True
    except Exception as e:
        log.error(f"[Cloudinary] Delete failed for {public_id}: {e}")
        return False
