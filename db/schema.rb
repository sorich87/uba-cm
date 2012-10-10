# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20121003074013) do

  create_table "active_admin_comments", :force => true do |t|
    t.string   "resource_id",   :null => false
    t.string   "resource_type", :null => false
    t.integer  "author_id"
    t.string   "author_type"
    t.text     "body"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
    t.string   "namespace"
  end

  add_index "active_admin_comments", ["author_type", "author_id"], :name => "index_active_admin_comments_on_author_type_and_author_id"
  add_index "active_admin_comments", ["namespace"], :name => "index_active_admin_comments_on_namespace"
  add_index "active_admin_comments", ["resource_type", "resource_id"], :name => "index_admin_notes_on_resource_type_and_resource_id"

  create_table "admin_users", :force => true do |t|
    t.string   "email",                  :default => "", :null => false
    t.string   "first_name",             :default => "", :null => false
    t.string   "last_name",              :default => "", :null => false
    t.string   "encrypted_password",     :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
    t.string   "role"
  end

  add_index "admin_users", ["email"], :name => "index_admin_users_on_email", :unique => true
  add_index "admin_users", ["reset_password_token"], :name => "index_admin_users_on_reset_password_token", :unique => true

  create_table "branches", :force => true do |t|
    t.string   "name"
    t.string   "city"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "computers", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "departments", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "devices", :force => true do |t|
    t.string   "name"
    t.integer  "model_id"
    t.integer  "computer_id"
    t.integer  "section_id"
    t.integer  "branch_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "devices", ["branch_id"], :name => "index_devices_on_branch_id"
  add_index "devices", ["computer_id"], :name => "index_devices_on_computer_id"
  add_index "devices", ["model_id"], :name => "index_devices_on_model_id"
  add_index "devices", ["section_id"], :name => "index_devices_on_section_id"

  create_table "features", :force => true do |t|
    t.string   "name"
    t.string   "value"
    t.integer  "model_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "features", ["model_id"], :name => "index_features_on_model_id"

  create_table "models", :force => true do |t|
    t.string   "name"
    t.string   "brand"
    t.string   "model_type"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "sections", :force => true do |t|
    t.string   "name"
    t.integer  "department_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "address"
    t.integer  "section_id"
    t.integer  "branch_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "users_computers", :id => false, :force => true do |t|
    t.integer "user_id"
    t.integer "computer_id"
  end

  add_index "users_computers", ["computer_id"], :name => "index_users_computers_on_computer_id"
  add_index "users_computers", ["user_id"], :name => "index_users_computers_on_user_id"

end
