class ApplicationController < ActionController::Base
  protect_from_forgery

  rescue_from CanCan::AccessDenied do |exception|
    redirect_to request.referer || root_url, :alert => exception.message
  end

  before_filter :set_locale

  def set_locale
    if current_admin_user
      I18n.locale = current_admin_user.language || I18n.default_locale
    else
      I18n.default_locale
    end
  end
end
