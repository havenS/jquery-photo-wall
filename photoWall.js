var yiiWall = {

    view            : 'open',
    albumID         : '',
    element         : '',
    container       : Array(),
    photoArray      : Array(),
    displayedPhotos : Array(),
    c_width         : 0,
    allowOverride   : false,
    maxRowHeight    : 200,
    photoMargin     : 5,
    baseURL         : '',
    url             : '',

    showPhoto : function(id,rID){
        var src             = $('#photo_'+id).attr('src'),
            photoDisplay    = $('#photoDisplay'+rID),
            img             = photoDisplay.children('.thumb').children('img');

        img.attr('src',src);
        img.attr('id','thumbPhoto_'+id);

        $('[name=photo_id]').val(id);

        $('[id^=photoDisplay]').css({display:'none'});
        photoDisplay.css({display:'block'});
    },

    photoDisplay : function(photoRow){

        var content = '' +
            '<div id="photoDisplay'+photoRow+'" style="display:none;" class="photoDisplay clearfix">'+
            '<div class="thumb">'+
                '<img>'+
            '</div>';

        content +='</div></div>';

        return content;

    },

    getNewIMGView : function(i, ywId, photoRow){
        return '<img onclick="yw.showPhoto(\''+this.displayedPhotos[ywId][i].id+'\','+photoRow+')" id="photo_'+this.displayedPhotos[ywId][i].id+'" class="photo_'+i+' photo" src="'+this.displayedPhotos[ywId][i].img_path+'" style="margin:'+this.photoMargin+'px;display: none" height="'+this.maxRowHeight+'"/>';
    },

    displayWall: function(ywId){

        this.c_width = this.container[ywId].width();

        var currentWidth    = 0,
            photoInRow      = Array(),
            currentP        = 1,
            photoCount      = 0,
            photoRow        = 1;
    
        while(photoCount < this.displayedPhotos[ywId].length){
            photoCount++;
        }

        for(var i in this.displayedPhotos[ywId]){

            if(currentP === 1) this.container[ywId].prepend('<div id="photoRow'+ywId+photoRow+'" class="pwr clearfix">');

            if(this.displayedPhotos[ywId][i].visible==1){
                var disPu ='none',
                    disUnpu ='block';
            }else{
                var disPu ='block',
                    disUnpu ='none';
            }

            var newIMG = this.getNewIMGView(i, ywId, photoRow);
    
            $("#photoRow"+ywId+photoRow).append(newIMG);

            var imgE = $('#photo_'+this.displayedPhotos[ywId][i].id);
    
            currentWidth += imgE.width();
    
            photoInRow.push(this.displayedPhotos[ywId][i].id);

            //TODO - Check if last row images grow bigger than maxrowheight if so, have an option to autorize it or not fill the last row or find a way to rebuild the row to have every row fullfilled
            if(currentWidth>this.c_width || currentP === photoCount){
                $("#photoRow"+ywId+photoRow).removeAttr('style');
    
                var ratio = (this.c_width-(this.photoMargin*2*photoInRow.length))/currentWidth;
    
                var pHeight = $('#photo_'+photoInRow[0]).height()*ratio;

                for(i in photoInRow){
    
                    var pWidth = $('#photo_'+photoInRow[i]).width();
    
                    if(pHeight > this.maxRowHeight && !this.allowOverride){
                        $('#photo_'+photoInRow[i]).attr('height',this.maxRowHeight);
                        if(this.view == 'closed'){
                            $('#thumbnail'+photoInRow[i]).css('height',this.maxRowHeight);
                            $('#thumbnail'+photoInRow[i]).css('width',pWidth);
                        }
                    }else{
                        $('#photo_'+photoInRow[i]).attr('height',pHeight);
                        $('#photo_'+photoInRow[i]).attr('width',pWidth*ratio);
                        if(this.view == 'closed'){
                            $('#thumbnail'+photoInRow[i]).css('height',pHeight);
                            $('#thumbnail'+photoInRow[i]).css('width',pWidth*ratio);
                        }
                    }
    
                }

                this.container[ywId].append(this.photoDisplay(photoRow));

                photoRow++;
                if(currentP != photoCount){
                    this.container[ywId].append('<div id="photoRow'+ywId+photoRow+'" class="pwr clearfix">');
                }
                currentWidth=0;
                photoInRow = Array();
    
            }

            currentP++;
    
        }

        $('.photoWall').hide();
        $('.photo').show();
        $('.photoWall').fadeIn();

    },

    prepareDisplayedPhotos : function(ywId){

        hiddenPhotos = this.container[ywId].find('img');
        dp = Array();

        hiddenPhotos.each(function(index,img){
            dp[index] = {
                'id'        : img.id,
                'img_path'  : img.src,
                'width'     : img.width,
                'height'    : img.height,
                'visible'   : ($(img).hasClass('visible')) ? '1' : '0'
            };
            img.remove();
        })

        this.displayedPhotos[ywId] = dp;
        this.container[ywId].css({"overflow":"inherit"});

        if(this.view != 'closed')
            this.displayWall(ywId);

    },

    generatePhotos : function(ywId){

        for(var i in this.photoArray){

            var p       = this.photoArray[i];
            var id      = p.id;
            var Ipath   = this.baseURL+p.img_path;
            var v       = p.visible;

            img                 = $('<img/>')[0];
            img.src             = Ipath;
            img.id              = id;
            img.style.opacity   = '0';
            img.style.position  = 'fixed';

            this.container[ywId].append(img);

            $(img).addClass((v == '1') ? 'visible':'hidden');

        }
    },

    init: function(ywId){

        this.container[ywId] = $(this.element+ywId);

        this.generatePhotos(ywId);

        if(this.view != 'closed'){
            $(window).load(function(){
                yw.prepareDisplayedPhotos(ywId)
            });
        }
    }

}

yw = yiiWall;