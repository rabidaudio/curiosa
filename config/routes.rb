Rails.application.routes.draw do

  # For now, we are ignoring API version. but in the future when a new version comes out,
  # we should be able to do something like this:
  # =>  http://www.bignerdranch.com/blog/adding-versions-rails-api/

  scope '/:api_verison/:format', constraints: {
    api_version: /v[0-9]+/,
    # subdomain: 'api',
  } do
    resources :images

    resources :users do
      resources :images
    end
  end

  root 'error#index'

  #fallthrough
  get '*unmatched_route', :to => 'error#unmatched'

end
