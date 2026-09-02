try:
    from fastapi import FastAPI
except ModuleNotFoundError as exc:
    raise RuntimeError(
        "FastAPI is not installed. Run: python -m pip install fastapi"
    ) from exc

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}