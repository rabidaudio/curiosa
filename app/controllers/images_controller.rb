class ImagesController < ApplicationController
  def show
    puts params
    @image = Image.find(1)
    #render json: @image
    render body: params
  end


end