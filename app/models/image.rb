class Image < ActiveRecord::Base
  validates :hash_id, format: {with: /\A[0-9a-f]{32}\z/, message: "Hashes should be in 32 digit hexadecimal format" }
end
