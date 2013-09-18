Coc::Application.routes.draw do
  root to: "welcome#index"

  resources :characters do
    resources :characteristic_sets
  end

  get '/name_maker/first/:gender', to: 'name_maker#first'
  get '/name_maker/surname', to: 'name_maker#surname'
  get '/name_maker/city', to: 'name_maker#city'
end
