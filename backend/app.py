from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Start with no uploaded dataset
current_df = None


@app.get("/")
def home():
    return {"message": "CSV Dashboard API Running"}


@app.get("/data")
def get_data():

    global current_df

    if current_df is None:
        return {
            "columns": [],
            "records": [],
            "names": [],
            "marks": [],
            "attendance": [],
            "subjects": [],
            "avg_marks": 0,
            "highest": 0,
            "lowest": 0,
            "total": 0
        }

    df = current_df

    return {
        "columns": df.columns.tolist(),

        "records": df.head(10).to_dict(
            orient="records"
        ),

        "names": df["Name"].tolist(),

        "marks": df["Marks"].tolist(),

        "attendance": df["Attendance"].tolist(),

        "subjects": df["Subject"].tolist(),

        "avg_marks": round(
            df["Marks"].mean(), 2
        ),

        "highest": int(
            df["Marks"].max()
        ),

        "lowest": int(
            df["Marks"].min()
        ),

        "total": len(df)
    }


@app.post("/upload")
async def upload_csv(
    file: UploadFile = File(...)
):

    global current_df

    content = await file.read()

    current_df = pd.read_csv(
        io.BytesIO(content)
    )

    return {
        "message": "CSV uploaded successfully"
    }