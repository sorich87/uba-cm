ActiveAdmin.register Computer do
  controller.authorize_resource

  controller do
    def action_methods
      if current_admin_user.admin?
        super
      else
        super - ['new', 'edit', 'destroy']
      end
    end
  end

  menu :priority => 2

  index do
    column :name
    column :fincon_number
    column t(:'activerecord.models.user') do |computer|
      computer.users.map{ |user| user.full_name }.uniq.join(', ')
    end
    column t(:'activerecord.models.branch') do |computer|
      computer.users.map{ |user| user.branch }.uniq.map{ |branch| branch.name }.join(', ')
    end
    column t(:'activerecord.models.device') do |computer|
      computer.devices.map{ |device| device.name }.uniq.join(', ')
    end
    default_actions
  end

  form do |f|
    f.inputs t(:"admin.labels.details") do
      f.input :name
      f.input :fincon_number
      f.input :users, member_label: :full_name
      f.input :devices, member_label: :name
    end

    f.inputs t(:'activerecord.models.feature') do
      f.has_many :features do |g|
        g.input :_destroy, :as => :boolean, :label => "delete" unless g.object.id.nil?
        g.input :name
        g.input :value
      end
    end
    f.buttons
  end

  csv do
    column :name
    column :fincon_number
    column("Devices") do |computer|
      computer.devices.map{ |device| device.name }.uniq.join(', ')
    end
    column "Users" do |computer|
      computer.users.map{ |user| user.full_name }.uniq.join(', ')
    end
    column "Branches" do |computer|
      computer.users.map{ |user| user.branch }.uniq.map{ |branch| branch.name }.join(', ')
    end
  end
end
