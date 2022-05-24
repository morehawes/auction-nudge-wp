/**
 * DO NOT EDIT THIS FILE! This script is for the WordPress admin area only.
 *
 * Information on customising Auction Nudge can be found here:
 * https://www.auctionnudge.com/customize/behaviour
 *
 */
function setup_parameter_groups() {
  jQuery('.an-parameter-group:not(.an-parameter-group-feed) .an-parameter-group-content').hide();
  jQuery('.an-parameter-group legend').each(function() {
  	var legend_text = jQuery(this).text();
		if(legend_text.indexOf('[+]') == -1) {
	  	jQuery(this).text(legend_text + ' [+]');			
		}
  });
  jQuery('.an-parameter-group legend').click(function() { 	
	  if(! jQuery('.an-parameter-group-content', jQuery(this).parent('.an-parameter-group')).is(':visible')) {
		  //Hide all
		  jQuery('.an-parameter-group-content', jQuery(this).parents('.an-custom-field-tab')).slideUp();
		  jQuery('.an-parameter-group-content', jQuery(this).parents('.an-widget-container')).slideUp();
		  //Show this
		  jQuery('.an-parameter-group-content', jQuery(this).parent('.an-parameter-group')).slideDown();		  
	  }
  });
}

function an_show_theme_options(theme, context) {
	//Carousel options
	jQuery('#carousel_scroll-container', context).hide();
	jQuery('#carousel_width-container', context).hide();
	jQuery('#carousel_auto-container', context).hide();
	//Grid options
	jQuery('#grid_width-container', context).hide();
	jQuery('#grid_cols-container', context).hide();
	//Common options
	jQuery('#cats_output-container', context).hide();	
	jQuery('#page-container', context).hide();		
	jQuery('#img_size-container', context).hide();		
	jQuery('#show_logo-container', context).hide();		
	switch(theme) {
		case 'carousel' : 
			jQuery('#carousel_scroll-container', context).show();
			jQuery('#carousel_width-container', context).show();
			jQuery('#carousel_auto-container', context).show();
			
			break;
		case 'grid' : 
			jQuery('#page-container', context).show();		
			jQuery('#grid_width-container', context).show();
			jQuery('#grid_cols-container', context).show();
			jQuery('#cats_output-container', context).show();
			jQuery('#img_size-container', context).show();		
			jQuery('#show_logo-container', context).show();		
										
			break;
		default:
			jQuery('#page-container', context).show();		
			jQuery('#cats_output-container', context).show();			
			jQuery('#img_size-container', context).show();		
			jQuery('#show_logo-container', context).show();		
			
			break;
	}
}

function setup_widget_theme_dropdown() {
	jQuery('.an-widget-container select').each(function() {
		if(jQuery(this).attr('id') == 'theme') {
			var widget_parent = jQuery(this).parents('.widget');
			an_show_theme_options(jQuery(this).val(), widget_parent);
			jQuery(this).change(function() {
				an_show_theme_options(jQuery(this).val(), widget_parent);							
			});
		}
	});
}

function adblock_check() {
	if(jQuery('#adblock-test').is(":hidden")) {
		var message = '<div id="an-adblock-detected" class="error settings-error notice"><p><b>Ad Blocker Detected!</b> It looks like you are using an plugin to block content from the page, this may prevent <b>Auction Nudge</b> from loading (<a href="https://www.auctionnudge.com/help/troubleshooting#not-loading" target="_blank">more info</a>)</p></div>';

		//Settings page
		if(jQuery('body').hasClass('settings_page_an_options_page')) {
			jQuery('#an-options-container').before(message);		
		//Edit post page
		} else {
			jQuery('#an-custom-fields').before(message);		
		}
	}			
}

function an_alt_inputs() {
	var i = 0;
	jQuery('.control-group').each(function() {
		if(jQuery(this).is(':visible')) {
			if((i%2 == 0)) {
				jQuery(this).addClass('alt');				
			}
			i++;
		}
	});
}

jQuery(document).ready(function() {
	setup_parameter_groups();
	setup_widget_theme_dropdown();
	
	var custom_field_parent = jQuery('#listings-tab');
	an_show_theme_options(jQuery('#theme').val(), custom_field_parent);
	jQuery('#theme').change(function() {
		an_show_theme_options(jQuery(this).val(), custom_field_parent);
	});	
		
	jQuery('ul#an-tab-links li a').on('click', function(e) {
		e.preventDefault();

		jQuery('ul#an-tab-links li a').removeClass('active');
		jQuery(this).addClass('active');
		
		var tab_show = jQuery(this).data('tab');
		
		//Hide all
		jQuery('.an-custom-field-tab').hide();		
		//Show this
		jQuery('.an-custom-field-tab#' + tab_show).show();
		
		return false;
	});
	
	jQuery('#an-theme-show').click(function() {
		jQuery('#an-theme-options').show();
		jQuery(this).parent('p').hide();
		
		return false;		
	});

	//Tooltips
	jQuery('a.an-tooltip').hover(function(){
	  var title = jQuery(this).data('title');
	  jQuery('<p id="tooltip-active"></p>').text(title).appendTo('body').fadeIn('slow');
	}, function() {
	  jQuery('#tooltip-active').remove();
	})
	.mousemove(function(e) {
	  var mousex = e.pageX + 5;
	  var mousey = e.pageY + 5;
	  jQuery('#tooltip-active').css({ top: mousey, left: mousex });
	});
	//Widgets
	jQuery('.widgets-holder-wrap')
		.on('mouseenter', 'a.an-tooltip', function() {
		  var title = jQuery(this).data('title');
		  jQuery('<p id="tooltip-active"></p>').text(title).appendTo('body').fadeIn('slow');
		})
		.on('mousemove', 'a.an-tooltip', function(e) {
		  var mousex = e.pageX + 5;
		  var mousey = e.pageY + 5;
		  jQuery('#tooltip-active').css({ top: mousey, left: mousex });			
		})
		.on('mouseleave', 'a.an-tooltip', function() {
		  jQuery('#tooltip-active').remove();
		});	

	//Adblock check
	window.setTimeout(adblock_check, 500);	
});

jQuery(document).ajaxSuccess(function(e, xhr, settings) {
	var widget_ids = ['an_listings_widget', 'an_ads_widget'];
	if(typeof settings.data !== 'undefined') {
		for(i in widget_ids) {
			if(settings.data.search('action=save-widget') != -1 && settings.data.search('id_base=' + widget_ids[i]) != -1) {
				setup_parameter_groups();
				setup_widget_theme_dropdown();	
			}		
		}		
	}
});