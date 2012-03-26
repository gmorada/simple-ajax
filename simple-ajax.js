$.fn.hasAttr = function(name) {
    return this.is('['+name+']');
};

$.fn.doAjax = function(_url, _method, _target, _form, _alert)
{
    //Coloque aqui a classe padrão para se colocar no elemento que está sendo carregado
    var loading = '';
    $('#'+_target).addClass(loading);
    var _data = {}

    if(_form)
    {
        if(!_method)
            _method = 'POST';
        _data = $('#'+_form).serialize();
    }

    if(!_method)
        _method = 'GET';

    if(eval(_alert))
    {
        $.ajax(
        {
            url : _url,
            type : _method,
            data: _data,
            success : function(response)
            {
                $('#'+_target).html(response);

                $(this).createGlobalEvents();
                $(this).createAjaxEvents();

                if (window.customCallback) { customCallback(); window.customCallback = undefined; }

                $('#'+_target).removeClass(loading);
            },
            error : function(response)
            {
                //Coloque aqui todos os erros que deseja tratar e como deseja tratar.
                if(response.status == 500)
                {
                    alert("Erro 500");
                    $('#'+_target).removeClass(loading);
                }
                else if(response.status == 404)
                {
                    alert("Erro 404");                    
                    $('#'+_target).removeClass(loading);
                }
            }
        });
    }
    else
    {
        $('#'+_target).removeClass(loading);
    }
};

$.fn.createGlobalEvents = function()
{
    //Coloque aqui os eventos que você deseja que sejam carregados ao final de cada requisição ajax
}

$.fn.createAjaxEvents = function()
{
    $.each($('._ajax'), function(i, elem)
    {
        var obj = $(elem);

        obj.removeClass('_ajax');

        var _url = obj.attr('href');
        var _method = false;

        //Coloque aqui o container padrão das requisições ajax
        var _target = "";

        //Coloque aqui o evento padrão para disparar as requisições ajax
        var _event = "click";

        var _alert = true;

        if(obj.is('a'))
            obj.attr('href', 'javascript:void(0)');
        else
            obj.removeAttr('href');

        var _form = false
        if(obj.hasAttr('data-form'))
        {
            _form = $.trim(obj.attr('data-form'));
            obj.removeAttr('data-form');
        }

        if(obj.hasAttr('data-method'))
        {
            _method = $.trim(obj.attr('data-method'));
            obj.removeAttr('data-method');
        }

        if(obj.hasAttr('data-target'))
        {
            _target = $.trim(obj.attr('data-target'));
            obj.removeAttr('data-target');
        }

        if(obj.hasAttr('data-alert'))
        {
            _alert = $.attr('data-alert');
            obj.removeAttr('data-alert');
        }

        if(obj.hasAttr('data-event'))
        {
            _event = $.attr('data-event');
            obj.removeAttr('data-event');
        }

        obj[_event](function(e){ e.stopPropagation(); $(this).doAjax(_url, _method, _target, _form, _alert);});
    });
};