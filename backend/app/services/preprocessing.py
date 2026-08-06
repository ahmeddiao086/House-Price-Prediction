import json
import pandas as pd

# 1. Read our saved list of safe locations right when the file opens.
with open("locations.json", "r") as file:
    allowed_locations = json.load(file)

def prepare_data(user_input):
    
    # 2. Check the location. If it's not in our list, call it "other"
    my_location = user_input.location
    if my_location not in allowed_locations:
        my_location = "other"

    # 3. Pack all the user's data into a simple Python dictionary.
    # Notice the left side (keys) now EXACTLY matches what your error message asked for!
    data_dictionary = {
        "total_area_sqft": user_input.carpet_area_sqft,
        "floor_clean": user_input.floor_num,
        "bathroom_clean": user_input.bathroom,
        "balcony_clean": user_input.balcony,
        "location_clean": my_location, 
        "Furnishing": user_input.furnishing,
        "Transaction": user_input.transaction,
        "Ownership": user_input.ownership,
        "facing": user_input.facing
    }
    
    # 4. Turn the dictionary into a 1-row Pandas table and send it out!
    return pd.DataFrame([data_dictionary])