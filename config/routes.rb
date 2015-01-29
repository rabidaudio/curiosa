Rails.application.routes.draw do

  # root 'welcome#index'

  # future reference: http://www.bignerdranch.com/blog/adding-versions-rails-api/

  scope '/:api_verison/:format', constraints: {
    api_version: /v[0-9]+/,
    format: /(json|xml)/
  } do
    
    #/i/<MD5SUM>/
    get 'i/:hash'               => 'images#show'
    put 'i/:hash'               => 'images#add'
    post 'i/:hash'              => 'images#update'
    delete 'i/:hash'            => 'images#delete'
    
    #/i/<MD5SUM>/rating
    get 'i/:hash/rating'        => 'images#get_rating'
    put 'i/:hash/rating'        => 'images#update_rating'
    post 'i/:hash/rating'       => 'images#add_rating'
    delete 'i/:hash/rating'     => 'images#delete_rating'
    
    #/i/<MD5SUM>/tags
    get 'i/:hash/tags'          => 'images#get_tags'
    put 'i/:hash/tags'          => 'images#update_tags'
    post 'i/:hash/tags'         => 'images#add_tags'
    delete 'i/:hash/tags'       => 'images#delete_tags'
    
    #/i/<MD5SUM>/tags/<N>
    get 'i/:hash/tags/:tag'     => 'images#get_tag'
    put 'i/:hash/tags/:tag'     => 'images#update_tag'
    post 'i/:hash/tags/:tag'    => 'images#add_tag'
    delete 'i/:hash/tags/:tag'  => 'images#delete_tag'

    
  end

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
