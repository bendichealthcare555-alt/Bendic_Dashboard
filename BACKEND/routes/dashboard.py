from fastapi import APIRouter
from database.supabase_client import supabase



router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

import pandas as pd
def get_party_master():

    response = (
        supabase
        .table("party_master")
        .select("*")
        .execute()
    )

    return pd.DataFrame(response.data)


def get_all_sales():

    all_rows = []
    start = 0
    batch_size = 1000

    while True:

        response = (
            supabase
            .table("sales_fact")
            .select("*")
            .range(start, start + batch_size - 1)
            .execute()
        )

        rows = response.data

        if not rows:
            break

        all_rows.extend(rows)

        if len(rows) < batch_size:
            break

        start += batch_size

    sales_df = pd.DataFrame(all_rows)

    if sales_df.empty:
        return sales_df

    party_df = get_party_master()

    if not party_df.empty:

        sales_df = sales_df.merge(
            party_df[
                ["party_name", "state", "district"]
            ],
            on="party_name",
            how="left"
        )

    sales_df["bill_date"] = pd.to_datetime(
        sales_df["bill_date"]
    )

    print(
        f"Loaded {len(sales_df)} rows from Supabase"
    )

    return sales_df


def get_filtered_sales(
    state=None,
    district=None,
    salesman=None,
    party=None,
    product=None,
    month=None,
    from_date=None,
    to_date=None
):

    sales_df = get_all_sales().copy()

    if sales_df.empty:
        return sales_df

    if state:
        sales_df = sales_df[
            sales_df["state"] == state
        ]

    if district:
        sales_df = sales_df[
            sales_df["district"] == district
        ]

    if salesman:
        sales_df = sales_df[
            sales_df["salesman"] == salesman
        ]

    if party:
        sales_df = sales_df[
            sales_df["party_name"] == party
        ]

    if product:
        sales_df = sales_df[
            sales_df["item_name"] == product
        ]

    if month:
        sales_df = sales_df[
            sales_df["bill_date"]
            .dt.strftime("%Y-%m")
            == month
        ]

    if from_date:
        sales_df = sales_df[
            sales_df["bill_date"]
            >= pd.to_datetime(from_date)
        ]

    if to_date:
        sales_df = sales_df[
            sales_df["bill_date"]
            <= pd.to_datetime(to_date)
        ]

    return sales_df

@router.get("/kpis")
def get_kpis(
    state: str = None,
    district: str = None,
    salesman: str = None,
    party: str = None,
    product: str = None,
    month: str = None,
    from_date: str = None,
    to_date: str = None
):

    df = get_filtered_sales(
        state,
        district,
        salesman,
        party,
        product,
        month,
        from_date,
        to_date
    )

    if df.empty:
        return {
            "status": "success",
            "total_sales": 0,
            "avg_monthly_sales": 0,
            "avg_bill_value": 0,
            "total_qty_sold": 0,
            "total_products": 0,
            "total_customers": 0,
            "total_bills": 0,
            "margin_percent": 0
        }

    df["amount"] = pd.to_numeric(
        df["amount"],
        errors="coerce"
    ).fillna(0)

    df["qty"] = pd.to_numeric(
        df["qty"],
        errors="coerce"
    ).fillna(0)

    df["free_qty"] = pd.to_numeric(
        df["free_qty"],
        errors="coerce"
    ).fillna(0)

    df["cost_amt"] = pd.to_numeric(
        df["cost_amt"],
        errors="coerce"
    ).fillna(0)

    total_sales = round(
        df["amount"].sum(),
        2
    )

    total_qty_sold = round(
        (
            df["qty"] +
            df["free_qty"]
        ).sum(),
        2
    )

    total_products = (
        df["item_name"]
        .nunique()
    )

    total_customers = (
        df["party_name"]
        .nunique()
    )

    total_bills = (
        df["bill_no"]
        .nunique()
    )

    avg_bill_value = round(
        total_sales / total_bills,
        2
    ) if total_bills > 0 else 0

    total_cost = round(
        df["cost_amt"].sum(),
        2
    )

    margin_percent = round(
        (
            (total_sales - total_cost)
            / total_sales
        ) * 100,
        2
    ) if total_sales > 0 else 0

    df["bill_date"] = pd.to_datetime(
        df["bill_date"]
    )

    min_date = df["bill_date"].min()
    max_date = df["bill_date"].max()

    months = (
        (max_date.year - min_date.year) * 12
        + (max_date.month - min_date.month)
        + 1
    )

    avg_monthly_sales = round(
        total_sales / months,
        2
    ) if months > 0 else 0

    return {
        "status": "success",
        "total_sales": total_sales,
        "avg_monthly_sales": avg_monthly_sales,
        "avg_bill_value": avg_bill_value,
        "total_qty_sold": total_qty_sold,
        "total_products": total_products,
        "total_customers": total_customers,
        "total_bills": total_bills,
        "margin_percent": margin_percent
    }


@router.get("/sales-trend")
def sales_trend(
    state: str = None,
    district: str = None,
    salesman: str = None,
    party: str = None,
    product: str = None,
    month: str = None,
    from_date: str = None,
    to_date: str = None
):

    df = get_filtered_sales(
        state,
        district,
        salesman,
        party,
        product,
        month,
        from_date,
        to_date
    )

    
    df = df[
        ["bill_date", "amount"]
    ]

    

    df["bill_date"] = pd.to_datetime(
        df["bill_date"]
    )

    df["month"] = (
        df["bill_date"]
        .dt.strftime("%Y-%m")
    )

    trend = (
        df.groupby("month")
        ["amount"]
        .sum()
        .reset_index()
    )

    trend["amount"] = (
        trend["amount"]
        .round(2)
    )

    return trend.to_dict(
        orient="records"
    )


## State Wise Sales##
@router.get("/state-wise-sales")
def state_wise_sales(
    state: str = None,
    district: str = None,
    salesman: str = None,
    party: str = None,
    product: str = None,
    month: str = None,
    from_date: str = None,
    to_date: str = None
):

    df = get_filtered_sales(
        state,
        district,
        salesman,
        party,
        product,
        month,
        from_date,
        to_date
    )

    if df.empty:
        return []

    result = (
        df.groupby("state")["amount"]
        .sum()
        .reset_index()
    )

    result["amount"] = result["amount"].round(2)

    return result.to_dict(
        orient="records"
    )



@router.get("/top-customers")
def top_customers(
    state: str = None,
    district: str = None,
    salesman: str = None,
    party: str = None,
    product: str = None,
    month: str = None,
    from_date: str = None,
    to_date: str = None
):

    df = get_filtered_sales(
        state,
        district,
        salesman,
        party,
        product,
        month,
        from_date,
        to_date
    )

    if df.empty:
        return []

    result = (
        df.groupby("party_name")["amount"]
        .sum()
        .reset_index()
    )

    result = result.sort_values(
        by="amount",
        ascending=False
    ).head(20)

    result["amount"] = result["amount"].round(2)

    return result.to_dict(
        orient="records"
    )

@router.get("/top-products")
def top_products(
    state: str = None,
    district: str = None,
    salesman: str = None,
    party: str = None,
    product: str = None,
    month: str = None,
    from_date: str = None,
    to_date: str = None
):

    df = get_filtered_sales(
        state,
        district,
        salesman,
        party,
        product,
        month,
        from_date,
        to_date
    )

    if df.empty:
        return []

    result = (
        df.groupby("item_name")["amount"]
        .sum()
        .reset_index()
    )

    result = result.sort_values(
        by="amount",
        ascending=False
    ).head(20)

    result["amount"] = result["amount"].round(2)

    return result.to_dict(
        orient="records"
    )

@router.get("/salesman-performance")
def salesman_performance(
    state: str = None,
    district: str = None,
    salesman: str = None,
    party: str = None,
    product: str = None,
    month: str = None,
    from_date: str = None,
    to_date: str = None
):

    df = get_filtered_sales(
        state,
        district,
        salesman,
        party,
        product,
        month,
        from_date,
        to_date
    )

    if df.empty:
        return []

    sales_df = df[
        ["party_name", "amount"]
    ]

    result = (
        df.groupby("salesman")
        .agg(
            sales=("amount", "sum"),
            bills=("bill_no", "nunique")
        )
        .reset_index()
    )

    result["sales"] = (
        result["sales"]
        .round(2)
    )

    result = result.sort_values(
        by="sales",
        ascending=False
    )

    return result.to_dict(
        orient="records"
    )

@router.get("/monthly-growth")
def monthly_growth(
    state: str = None,
    district: str = None,
    salesman: str = None,
    party: str = None,
    product: str = None,
    month: str = None,
    from_date: str = None,
    to_date: str = None 
):

    df = get_filtered_sales(
        state,
        district,
        salesman,
        party,
        product,
        month,
        from_date,
        to_date
    )

    if df.empty:
        return []

    df["bill_date"] = pd.to_datetime(
        df["bill_date"]
    )

    df["month"] = (
        df["bill_date"]
        .dt.strftime("%Y-%m")
    )

    result = (
        df.groupby("month")["amount"]
        .sum()
        .reset_index()
    )

    result["growth_percent"] = (
        result["amount"]
        .pct_change() * 100
    )

    result["growth_percent"] = (
        result["growth_percent"]
        .fillna(0)
        .round(2)
    )

    return result.to_dict(
        orient="records"
    )

@router.get("/customer-retention")
def customer_retention(
    state: str = None,
    district: str = None,
    salesman: str = None,
    party: str = None,
    product: str = None,
    month: str = None,
    from_date: str = None,
    to_date: str = None
):

    df = get_filtered_sales(
        state,
        district,
        salesman,
        party,
        product,
        month,
        from_date,
        to_date
    )

    if df.empty:
        return []

    df["bill_date"] = pd.to_datetime(df["bill_date"])

    latest_month = (
        df["bill_date"]
        .dt.strftime("%Y-%m")
        .max()
    )

    first_purchase = (
        df.groupby("party_name")["bill_date"]
        .min()
        .reset_index()
    )

    first_purchase["first_month"] = (
        first_purchase["bill_date"]
        .dt.strftime("%Y-%m")
    )

    new_customers = (
        first_purchase[
            first_purchase["first_month"] == latest_month
        ]["party_name"]
        .nunique()
    )

    total_customers = (
        df["party_name"]
        .nunique()
    )

    repeat_customers = (
        total_customers - new_customers
    )

    return [
        {
            "month": latest_month,
            "customer_type": True,
            "count": int(new_customers)
        },
        {
            "month": latest_month,
            "customer_type": False,
            "count": int(repeat_customers)
        }
    ]

@router.get("/slow-moving-products")
def slow_moving_products(
    state: str = None,
    district: str = None,
    salesman: str = None,
    party: str = None,
    product: str = None,
    month: str = None,
    from_date: str = None,
    to_date: str = None
):

    df = get_filtered_sales(
        state,
        district,
        salesman,
        party,
        product,
        month,
        from_date,
        to_date
    )

    if df.empty:
        return []

    df["bill_date"] = pd.to_datetime(
        df["bill_date"]
    )

    cutoff_date = (
        pd.Timestamp.today()
        - pd.DateOffset(months=6)
    )

    recent_df = df[
        df["bill_date"] >= cutoff_date
    ]

    result = (
        recent_df
        .groupby("item_name")["amount"]
        .sum()
        .reset_index()
    )

    result = result.sort_values(
        by="amount",
        ascending=True
    ).head(50)

    return result.to_dict(
        orient="records"
    )


@router.get("/dead-stock")
def dead_stock(
    state: str = None,
    district: str = None,
    salesman: str = None,
    party: str = None,
    product: str = None,
    month: str = None,
    from_date: str = None,
    to_date: str = None
):

    df = get_filtered_sales(
        state,
        district,
        salesman,
        party,
        product,
        month,
        from_date,
        to_date
    )

    if df.empty:
       return []

    df["bill_date"] = pd.to_datetime(
        df["bill_date"]
    )

    latest_sale = (
        df.groupby("item_name")["bill_date"]
        .max()
        .reset_index()
    )

    cutoff_date = (
        pd.Timestamp.today()
        - pd.DateOffset(months=6)
    )

    dead_stock = latest_sale[
        latest_sale["bill_date"]
        < cutoff_date
    ]

    dead_stock["last_sale"] = (
        dead_stock["bill_date"]
        .dt.strftime("%Y-%m-%d")
    )

    return dead_stock[
        ["item_name", "last_sale"]
    ].to_dict(
        orient="records"
    )

@router.get("/filters")
def dashboard_filters():

    sales_df = get_all_sales()

    party_df = get_party_master()

    return {
        "states": sorted(
            party_df["state"]
            .dropna()
            .unique()
            .tolist()
        ),

        "districts": sorted(
            party_df["district"]
            .dropna()
            .unique()
            .tolist()
        ),

        "salesmen": sorted(
            sales_df["salesman"]
            .dropna()
            .unique()
            .tolist()
        ),

        "parties": sorted(
            sales_df["party_name"]
            .dropna()
            .unique()
            .tolist()
        ),

        "products": sorted(
            sales_df["item_name"]
            .dropna()
            .unique()
            .tolist()
        )
    }
