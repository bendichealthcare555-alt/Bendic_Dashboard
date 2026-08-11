import pandas as pd


def apply_filters(
    df,
    state=None,
    district=None,
    salesman=None,
    months=None
):

    if state:
        df = df[
            df["state"].isin(state)
        ]

    if district:
        df = df[
            df["district"].isin(district)
        ]

    if salesman:
        df = df[
            df["salesman"].isin(salesman)
        ]

    if months:
        df = df[
            df["month"].isin(months)
        ]

    return df

