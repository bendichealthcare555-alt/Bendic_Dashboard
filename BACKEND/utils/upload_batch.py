from datetime import datetime
import uuid

def generate_upload_batch_id():

    date_part = datetime.now().strftime("%Y%m%d")

    unique_part = str(uuid.uuid4())[:8]

    return f"UPLOAD-{date_part}-{unique_part}"