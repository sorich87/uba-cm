ActiveAdmin.register_page "Dashboard" do
  menu :priority => 1, :label => proc{ I18n.t("active_admin.dashboard") }

  content :title => proc{ I18n.t("active_admin.dashboard") } do
     columns do
       column do
         panel "Info" do
           para "Welcome to United Bank of Africa Computer Management System."
           para "Please use the links above to navigate the database."
         end
       end

       column do
         panel "Admins List" do
           ul do
             AdminUser.where(role: 'admin').map do |admin_user|
               if current_admin_user.admin?
                 li link_to(admin_user.full_name || admin_user.email, cm_admin_user_path(admin_user))
               else
                 li admin_user.full_name || admin_user.email
               end
             end
           end
         end
       end
     end
  end # content
end
