from database.supabase_client import supabase
from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
from utils.upload_batch import generate_upload_batch_id

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

# =========================
# PARTY MASTER UPLOAD
# =========================

@router.post("/party-master")
async def upload_party_master(
    file: UploadFile = File(...)
):

    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(
            status_code=400,
            detail="Only Excel files are allowed"
        )

    try:

        df = pd.read_excel(file.file)

        df.columns = df.columns.str.strip()

        required_columns = [
            "Party Name",
            "District",
            "State"
        ]

        missing_columns = [
            col
            for col in required_columns
            if col not in df.columns
        ]

        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing columns: {missing_columns}"
            )

        df = df.dropna(how="all")

        df = df.fillna("")

        df = df.drop_duplicates(
            subset=["Party Name"]
)

        # Convert dataframe to records
        records = []

        for _, row in df.iterrows():

            records.append({
                "party_name": str(row["Party Name"]).strip(),
                "district": str(row["District"]).strip(),
                "state": str(row["State"]).strip()
            })

        # Insert into Supabase
        result = (
            supabase
            .table("party_master")
            .insert(records)
            .execute()
        )
        from routes.dashboard import get_all_sales
        get_all_sales.cache_clear()
        return {
            "status": "success",
            "rows_inserted": len(records)
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@router.get("/batch-test")
def batch_test():

    return {
        "upload_batch_id":
        generate_upload_batch_id()
    }

@router.post("/sales")
async def upload_sales(
    file: UploadFile = File(...)
):

    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(
            status_code=400,
            detail="Only Excel files are allowed"
        )

    try:

        df = pd.read_excel(file.file)

        df.columns = df.columns.str.strip()

        required_columns = [
            "Date",
            "Party Name",
            "Item Name",
            "Bill No#",
            "Batch",
            "Qty",
            "Free Qty",
            "Rate",
            "Scheme",
            "Discount",
            "Amount",
            "Bill Amount",
            "Cost",
            "Cost Amt",
            "Sales Men"
        ]
        upload_batch_id = generate_upload_batch_id()

        missing_columns = [
            col
            for col in required_columns
            if col not in df.columns
        ]

        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing columns: {missing_columns}"
            )

        # Remove fully blank rows
        df = df.dropna(how="all")

        total_rows = len(df)

        # Cleaning Rules

        batch_null_df = df[df["Batch"].isna()]

        rate_null_df = df[df["Rate"].isna()]

        rate_zero_df = df[df["Rate"] == 0]

        staff_df = df[
            df["Party Name"]
            .astype(str)
            .str.contains(
                "staff",
                case=False,
                na=False
            )
        ]

        rejected_indexes = set()

        rejected_indexes.update(batch_null_df.index)
        rejected_indexes.update(rate_null_df.index)
        rejected_indexes.update(rate_zero_df.index)
        rejected_indexes.update(staff_df.index)

        valid_df = df.drop(
            index=list(rejected_indexes)
        )
        cleaning_records = []
        for _, row in batch_null_df.iterrows():

            cleaning_records.append({
                "upload_batch_id": upload_batch_id,
                "party_name": str(row["Party Name"]),
                "item_name": str(row["Item Name"]),
                "bill_no": str(row["Bill No#"]),
                "batch": "",
                "reason": "Missing Batch"
            })
        for _, row in rate_null_df.iterrows():

            cleaning_records.append({
                "upload_batch_id": upload_batch_id,
                "party_name": str(row["Party Name"]),
                "item_name": str(row["Item Name"]),
                "bill_no": str(row["Bill No#"]),
                "batch": str(row["Batch"]),
                "reason": "Rate Missing"
            })
        for _, row in rate_zero_df.iterrows():

            cleaning_records.append({
                "upload_batch_id": upload_batch_id,
                "party_name": str(row["Party Name"]),
                "item_name": str(row["Item Name"]),
                "bill_no": str(row["Bill No#"]),
                "batch": str(row["Batch"]),
                "reason": "Rate Zero"
            })

        for _, row in staff_df.iterrows():

            cleaning_records.append({
                "upload_batch_id": upload_batch_id,
                "party_name": str(row["Party Name"]),
                "item_name": str(row["Item Name"]),
                "bill_no": str(row["Bill No#"]),
                "batch": str(row["Batch"]),
                "reason": "Staff Account"
            })

        if cleaning_records:

            supabase.table(
                "cleaning_log"
            ).insert(
                cleaning_records
            ).execute()

        # =========================
        # PREPARE SALES RECORDS
        # =========================

        valid_df = valid_df.copy()

        valid_df["Date"] = pd.to_datetime(
            valid_df["Date"],
            errors="coerce"
        )

        valid_df = valid_df.fillna("")

        sales_records = []

        for _, row in valid_df.iterrows():

            duplicate_key = (
                f"{str(row['Party Name']).strip()}|"
                f"{str(row['Item Name']).strip()}|"
                f"{str(row['Bill No#']).strip()}|"
                f"{str(row['Batch']).strip()}"
            )

            sales_records.append({
                "party_name": str(row["Party Name"]).strip(),
                "item_name": str(row["Item Name"]).strip(),
                "bill_no": str(row["Bill No#"]).strip(),
                "batch": str(row["Batch"]).strip(),
                "qty": float(row["Qty"]) if row["Qty"] != "" else 0,
                "free_qty": float(row["Free Qty"]) if row["Free Qty"] != "" else 0,
                "rate": float(row["Rate"]) if row["Rate"] != "" else 0,
                "scheme": 0,
                "duplicate_key": duplicate_key,
                "discount": float(row["Discount"]) if row["Discount"] != "" else 0,
                "amount": float(row["Amount"]) if row["Amount"] != "" else 0,
                "bill_amount": float(row["Bill Amount"]) if row["Bill Amount"] != "" else 0,
                "cost": float(row["Cost"]) if row["Cost"] != "" else 0,
                "cost_amt": float(row["Cost Amt"]) if row["Cost Amt"] != "" else 0,
                "salesman": str(row["Sales Men"]).strip(),
                "upload_batch_id": upload_batch_id,
                "bill_date": (
                    row["Date"].strftime("%Y-%m-%d")
                    if pd.notna(row["Date"])
                    else None
                )
            })

        # =========================
        # DUPLICATE REPLACEMENT
        # =========================

        duplicate_keys = [
            record["duplicate_key"]
            for record in sales_records
        ]

        existing_rows = (
            supabase
            .table("sales_fact")
            .select("id,duplicate_key")
            .in_("duplicate_key", duplicate_keys)
            .execute()
        )

        existing_ids = [
            row["id"]
            for row in existing_rows.data
        ]

        if existing_ids:

            supabase.table(
                "sales_fact"
            ).delete().in_(
                "id",
                existing_ids
            ).execute()

        # =========================
        # INSERT SALES FACT
        # =========================

        if sales_records:

            supabase.table(
                "sales_fact"
            ).insert(
                sales_records
            ).execute()

        # =========================
        # DATA PERIOD
        # =========================

        min_bill_date = None
        max_bill_date = None

        if not valid_df.empty:

            valid_dates = valid_df["Date"].dropna()

            if len(valid_dates) > 0:
                min_bill_date = valid_dates.min().strftime("%Y-%m-%d")
                max_bill_date = valid_dates.max().strftime("%Y-%m-%d")

        # =========================
        # SAVE UPLOAD HISTORY
        # =========================

        supabase.table(
            "upload_history"
        ).insert({
            "upload_batch_id": upload_batch_id,
            "file_name": file.filename,
            "total_rows": total_rows,
            "inserted_rows": len(sales_records),
            "rejected_rows": len(cleaning_records),

            "from_bill_date": min_bill_date,
            "to_bill_date": max_bill_date

        }).execute()

        return {
            "status": "success",
            "upload_batch_id": upload_batch_id,
            "file_name": file.filename,
            "total_rows": total_rows,
            "inserted_rows": len(sales_records),
            "replaced_rows": len(existing_ids),
            "rejected_rows": len(cleaning_records),
            "batch_missing": len(batch_null_df),
            "rate_missing": len(rate_null_df),
            "rate_zero": len(rate_zero_df),
            "staff_rows": len(staff_df)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@router.get("/history")
def get_upload_history():

    result = (
        supabase
        .table("upload_history")
        .select("*")
        .order("uploaded_at", desc=True)
        .execute()
    )

    return result.data

@router.get("/cleaning-log")
def get_cleaning_log():

    result = (
        supabase
        .table("cleaning_log")
        .select("*")
        .order("id", desc=True)
        .limit(1000)
        .execute()
    )

    return result.data

@router.get("/cleaning-log/{batch_id}")
def get_cleaning_log_batch(batch_id: str):

    result = (
        supabase
        .table("cleaning_log")
        .select("*")
        .eq("upload_batch_id", batch_id)
        .order("id", desc=True)
        .execute()
    )

    return result.data