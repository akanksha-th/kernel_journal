import os

BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
# print(BASE)
DATA_RAW = os.path.join(BASE, "data/raw_data")
DATA_PROCESSED = os.path.join(BASE, "data/processed")
NORMALIZATION_PARAMS = os.path.join(DATA_PROCESSED, "norm_params.json")
WINDOWED_DATA = os.path.join(DATA_PROCESSED, "windows")