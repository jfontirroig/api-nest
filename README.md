<
## CURL Test

curl --location 'https://localhost:3380/nest-api-session/sessiondata' \
--header 'Authorization: OeaNUqeepxbJanUDhorwlGf0mdBaHfDD' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'realm=ubid.app' \
--data-urlencode 'client=miamicity.app' \
--data-urlencode 'session=5f49c355-74d4-48ca-bc32-8861294bc66c' -k


curl --location 'https://localhost:3380/nest-api-session/userdata' \
--header 'Authorization: OeaNUqeepxbJanUDhorwlGf0mdBaHfDD' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'realm=ubid.app' \
--data-urlencode 'client=miamicity.app' \
--data-urlencode 'username=jfontirroig.ubid.app' -k
