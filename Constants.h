//
//  Constants.h
//  Twittia 2
//
//  Created by Jeena on 01.05.10.
//  Licence: BSD (see attached LICENCE.txt file).
//

#import <Foundation/Foundation.h>
#import <Carbon/Carbon.h>


@interface Constants : NSObject {

}


#ifdef USE_TWITTER

#define API_URL @"http://api.twitter.com/1/"
#define OAUTH_CONSUMER_KEY @"JPmU8KJhiBKfpohCiWLg"
#define OAUTH_CONSUMER_SECRET @"jtfSrnDrRcUnL1nqTMcAW0055m63EMClmkxhiBjQ"
#define OAUTH_SIGNATURE_METHOD @"HMAC-SHA1"
#define OAUTH_REQUEST_TOKEN_URL @"http://twitter.com/oauth/request_token"
#define OAUTH_USER_AUTHORIZATION_URL @"http://twitter.com/oauth/authorize"
#define OAUTH_ACCESS_TOKEN_URL @"http://twitter.com/oauth/access_token"
#define OAUTH_SERVICE_NAME @"twitter.com"

#else

#define API_URL @"http://identi.ca/api/"
#define OAUTH_CONSUMER_KEY @"76cb48ce4c65a9c760078b60aa9ce18f"
#define OAUTH_CONSUMER_SECRET @"519f5624b2024983369371b2ba389591"
#define OAUTH_SIGNATURE_METHOD @"HMAC-SHA1"
#define OAUTH_REQUEST_TOKEN_URL @"http://identi.ca/api/oauth/request_token"
#define OAUTH_USER_AUTHORIZATION_URL @"http://identi.ca/api/oauth/authorize"
#define OAUTH_ACCESS_TOKEN_URL @"http://identi.ca/api/oauth/access_token"
#define OAUTH_SERVICE_NAME @"identi.ca"

#endif

#define APP_NAME @"Twittia"
#define TWEET_MAX_LENGTH 140

+ (NSString *)stringFromVirtualKeyCode:(NSInteger)code;

@end
