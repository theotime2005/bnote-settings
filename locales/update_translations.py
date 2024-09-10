"""
This script actualize translation in locales folder
"""
import json
import sys

def load_file(file):
    with open(file, "r") as f:
        return json.load(f)

def write_file(file, data):
    with open(file, "w") as f:
        json.dump(data, f, indent=4)

other_file = load_file(sys.argv[1])
fr = load_file("fr.json")

def check_and_update(obj_start, other_obj):
    for key in obj_start:
        if key not in other_obj:
            other_obj[key] = obj_start[key]
        elif isinstance(obj_start[key], dict):
            check_and_update(obj_start[key], other_obj[key])
    return other_obj

new_file = check_and_update(fr, other_file)

write_file(sys.argv[1], new_file)