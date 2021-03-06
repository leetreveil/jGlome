/**
 * Rudimentary clickable functionality to Glome template
 *
 * Copyright (C) 2013 Glome Oy <contact@glome.me>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
jQuery(function()
{
  'use strict';

  // Set the default view
  if (!window.location.hash.match(/#.+/))
  {
    window.location.hash = '#public-startup';
  }

  jQuery('[data-i18n]')
    .each(function()
    {
      var str = jQuery(this).attr('data-i18n');

      // Check for arguments
      if (jQuery(this).attr('data-i18n-arguments'))
      {
        var i18nArgs = [str];
        try
        {
          var args = JSON.parse(jQuery(this).attr('data-i18n-arguments'));
          i18nArgs = i18nArgs.concat(args);
          var l10n = jQuery.i18n.apply(null, i18nArgs)
        }
        catch (e)
        {
          console.warn(e, str);
        }
      }
      else
      {
        var l10n = jQuery.i18n(str);
      }

      if (jQuery(this).attr('placeholder'))
      {
        jQuery(this).attr('placeholder', l10n);
      }
      else
      {
        jQuery(this).text(l10n);
      }
    });

  var select = jQuery('<select />')
    .on('change', function()
    {
      window.location.hash = '#' + jQuery(this).val();
    })
    .attr('id', 'glomeTemplateSwitch')
    .prependTo('body')
    .css
    (
      {
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 20000
      }
    );

  var pages = jQuery('[data-page]');

  for (var i = 0; i < pages.size(); i++)
  {
    var page = pages.eq(i).attr('data-page');
    var context = pages.eq(i).parents('[data-glome-container]').attr('data-context');

    var option = jQuery('<option />')
      .attr('value', context + '-' + page)
      .text(context + ': ' + page)
      .appendTo(select);
  }

  jQuery('#glomeAdminContent').find('[data-glome-template="admin-subscriptions"] .glome-row').eq(0).cloneTimes(15);
  jQuery('#glomeAdminContent').find('[data-glome-template="admin-rewards"] .glome-row').eq(0).cloneTimes(15);
  jQuery('#glomePublicContent').find('[data-glome-template="public-subscriptions"] .glome-row').eq(0).cloneTimes(15);
  jQuery('#glomePublicContent').find('[data-glome-template="public-category"] .glome-row').eq(0).cloneTimes(15);
  jQuery('#glomePublicContent').find('[data-glome-template="public-categorylist"] .glome-row').eq(0).cloneTimes(15);

  jQuery('.glome-close')
    .on('click', function()
    {
      window.location.hash = '#widget';
    });

  jQuery('#glomePublicFinish').find('button')
    .on('click', function()
    {
      window.location.hash = '#widget-widget';
    });

  jQuery('.glome-pager button')
    .on('click', function()
    {
      var context = jQuery(this).parents('[data-glome-container]').attr('data-context');

      if (jQuery(this).hasClass('left'))
      {
        var page = jQuery(this).parents('[data-page]').prev().attr('data-page');
      }
      else
      {
        var page = jQuery(this).parents('[data-page]').next().attr('data-page');
      }

      window.location.hash = '#' + context + '-' + page;
    });

  jQuery('.glome-button[data-state]')
    .on('click', function(e)
    {
      if (jQuery(this).attr('data-state-change') === 'false')
      {
        return true;
      }

      if (jQuery(this).attr('data-state') === 'on')
      {
        jQuery(this).attr('data-state', 'off');
      }
      else
      {
        jQuery(this).attr('data-state', 'on');
      }
    });

  jQuery('#glomePublicStartup').find('.glome-button')
    .off('click')
    .on('click', function()
    {
      window.location.hash = '#public-subscriptions';
    });

  jQuery('[data-glome-template="admin-subscriptions"], [data-glome-template="public-subscriptions"]').find('.glome-button[data-state]')
    .on('click', function(e)
    {
      var total = jQuery(this).parents('.glome-content').find('.glome-button[data-state]').size();
      var on = jQuery(this).parents('.glome-content').find('.glome-button[data-state="on"]').size();

      jQuery(this).parents('.glome-content').find('.glome-selection-counter .glome-current').text(on);
      jQuery(this).parents('.glome-content').find('.glome-selection-counter .glome-max').text(total);
    });

  jQuery('[data-glome-template="admin-subscriptions"], [data-glome-template="public-subscriptions"]').find('.glome-button[data-state]:first').trigger('click');

  jQuery('#glomeWidget')
    .on('click', function()
    {
      if (jQuery(this).attr('data-state') == 'knock')
      {
        jQuery(this).attr('data-state', 'open');
      }
      else
      {
        jQuery(this).attr('data-state', 'knock');
      }
    });

  jQuery(window)
    .on('hashchange', function()
    {
      var hash = window.location.hash.toString().replace(/#/, '');
      var regs = hash.match(/(admin|public|widget)/);

      if (!regs)
      {
        return;
      }

      var regexp = new RegExp(regs[1] + '-');
      var context = regs[1];
      var page = hash.replace(regexp, '');

      jQuery('#glomeTemplateSwitch').find('option[value="' + context + '-' + page + '"]').attr('selected', 'selected').siblings().removeAttr('selected');

      // Toggle main context
      jQuery('[data-context="' + context + '"]').siblings().addClass('hidden');
      jQuery('[data-context="' + context + '"]').removeClass('hidden');

      // Toggle context page
      jQuery('[data-context="' + context + '"]').oneTime('1s', function()
      {
        jQuery(this).find('#glomeAdminContent, #glomePublicContent, #glomeWidgetContent').find('[data-context="glome-content-area"] > .glome-content').not('[data-glome-template="' + hash + '"]').addClass('hidden');
        jQuery(this).find('#glomeAdminContent, #glomePublicContent, #glomeWidgetContent').find('[data-context="glome-content-area"] > .glome-content').filter('[data-glome-template="' + hash + '"]').removeClass('hidden');
      });

      // Toggle navigation selected item
      jQuery('[data-context="' + context + '"]').find('> .glome-header').find('[data-page="' + page + '"]').addClass('selected');
      jQuery('[data-context="' + context + '"]').find('> .glome-header').find('[data-page="' + page + '"]').siblings().removeClass('selected');
    })
    .trigger('hashchange');

});

jQuery.fn.cloneTimes = function(times)
{
  for (var i = 0; i < Number(times); i++)
  {
    var cloned = jQuery(this).clone(false);
    cloned.insertAfter(jQuery(this));
  }
}