class CreateMetadata < ActiveRecord::Migration
  def change
    create_table :metadata do |t|
      t.belongs_to :image, index: true
      t.belongs_to :user, index: true
      t.integer :rating
      t.timestamps null: false
    end
    change_table :tags do |t|
      t.belongs_to :metadatum, index: true
    end
  end
end
