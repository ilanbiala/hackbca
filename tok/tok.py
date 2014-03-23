import OpenTokSDK
 
api_key = "44704392"
api_secret = "c196cd873a254b3f92b6efbcaab769c43729034f"
 
opentok_sdk = OpenTokSDK.OpenTokSDK(api_key, api_secret)
session = opentok_sdk.create_session()
token = opentok_sdk.generate_token()
print session.session_id + '$' + token