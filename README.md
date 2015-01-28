/i/<MD5SUM>/
  GET => hash, average_rating, top_tags
  POST,PUSH, DELETE => no-op
  /rating
  /tags

/u/<UUID>/
  GET => uuid, images_count, ...
  *POST => create new user
  *PUSH => update user
  *DELETE => delete user

/u/<UUID>/i/<MD5SUM>/rating
  GET = > number
  *PUT/POST => update number and return
  *DELTE => delete rating

/u/<UUID>/i/<MD5SUM>/tags
  GET = > number
  *PUT/POST => update number and return
  *DELTE => delete tags