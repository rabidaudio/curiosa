class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string :hash_id

      t.timestamps null: false
    end
  end
end
