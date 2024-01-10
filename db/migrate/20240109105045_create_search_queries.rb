class CreateSearchQueries < ActiveRecord::Migration[7.1]
  def change
    create_table :search_queries do |t|
      t.string :query
      t.string :downcased_query
      t.string :ip_address

      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
