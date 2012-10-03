class AdminAbility
  include CanCan::Ability

  def initialize(admin_user)
    return if admin_user.nil?

    if admin_user.admin?
      can :manage, :all
    else
      can :read, :all
    end
  end
end
