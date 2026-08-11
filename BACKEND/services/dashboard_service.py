from database.supabase_client import supabase
import pandas as pd


def get_sales_dataframe():

    sales = (
        supabase
        .table("sales_fact")
        .select("*")
        .execute()
    )

    if not sales.data:
        return pd.DataFrame()

    df = pd.DataFrame(
        sales.data
    )

    return df