import re


def special_match(strg):
    search = re.compile(r'[^a-z0-9.A-Zа-яА-ЯіІыЫ@,\-()!?+/\'\" \n]').search
    return not bool(search(strg))


def sanitize_dict(input_dict):
    for key in input_dict:
        if not special_match(key) or not special_match(input_dict[key]):
            return False
    return True
