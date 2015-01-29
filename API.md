```
/i/<MD5SUM>/
  GET       => hash, average_rating, top_tags
  *POST     => add/update         *DISABLED*
  *PUT      => add                *DISABLED*
  *DELETE   => delete             *DISABLED*
/i/<MD5SUM>/rating
  GET       => average rating
  *POST     => add                *DISABLED*
  *PUT      => update             *DISABLED*
  *DELETE   => delete             *DISABLED*
/i/<MD5SUM>/tags
  GET       => return top tags
  *POST     => add tags           *DISABLED*
  *PUT      => replace all tags   *DISABLED*
  *DELTE    => delete tags        *DISABLED*
/i/<MD5SUM>/tags/<N>
  GET       => tag
  *POST     => add tag            *DISABLED*
  *PUT      => update tag         *DISABLED*
  *DELTE    => delete tag         *DISABLED*


/u/<UUID>/
  GET     => uuid, images_count, ...
  *PUT    => create new user
  *POST   => update user
  *DELETE => delete user

/u/<UUID>/i/<MD5SUM>/rating
  GET       => number
  *POST     => add number
  *PUT      => update number
  *DELTE    => delete number

/u/<UUID>/i/<MD5SUM>/tags
  GET       => array (limit, 50), allow sort
  *POST     => add tags
  *PUT      => replace all tags
  *DELTE    => delete tags

/u/<UUID>/i/<MD5SUM>/tags/<N>
  GET       => tag
  *POST     => add tag
  *PUT      => update tag
  *DELTE    => delete tag
  ```