function setIcon(){
    $('.status-icon').css({
        backgroundPosition: $("#applicant_status").val() * 60
    });
}

$(document).ready(function() {
    //Scroll
    $('.animated-scroll').click(function(){
        $("html,body").animate({scrollTop: $($(this).attr('href')).offset().top-$('#header').outerHeight()}, 500 );
        return false;
    });
    // notes
    $("#dialog-note-delete").dialog({
        autoOpen: false,
        modal: true
    });
    $("#dialog-note-form").dialog({
        autoOpen: false,
        modal: true
    });

    $('.edit_note').live('click', function(){
        $("#dialog-note-form").attr('data-note-action', 'edit');
        $("#dialog-note-form").attr('data-note-id', $(this).attr('data-note-id'));
        $("#note_edit_text").attr('value', $(this).attr('data-note-text'));
        $("#dialog-note-form").dialog('open');
    });

    $('.add_note').live('click', function(){
        $("#dialog-note-form").attr('data-note-action', 'add');
        $("#dialog-note-form").attr('data-note-id', '');
        $("#note_edit_text").attr('value', '');
        $("#dialog-note-form").dialog('open');
    });

    $('.delete_note').live('click', function(){
        $("#dialog-note-delete").attr('data-note-id', $(this).attr('data-note-id'));
        $("#dialog-note-delete").dialog('open');
    });

    $('#note-delete-submit').bind('click', function(){
        $.post(jobboard.ajax.note_delete,
            {
                'noteID': $("#dialog-note-delete").attr('data-note-id')
            },
            function(data) {
                $('.delete_note[data-note-id="' + $("#dialog-note-delete").attr('data-note-id') + '"]').parents('.note').remove();
                if(!$('div').hasClass('note well')) {
                    var note_container = $('<div>').attr('class', 'note empty-note well ui-rounded-corners').append($('<p>').html(jobboard.langs.empty_note_text));
                    $('#nots_table_div').append(note_container);
                    $(note_container).effect("highlight", {}, 500);
                }
                $("#dialog-note-delete").dialog('close');
            },
            'json'
        );
    });

    $('#note-form-submit').bind('click', function() {
        var ajax_url = '';
        if( $("#dialog-note-form").attr('data-note-action') == 'add') {
            ajax_url = jobboard.ajax.note_add;
        } else {
            ajax_url = jobboard.ajax.note_edit;
        }
        $.post(ajax_url,
            {
                'applicantID': $("#dialog-note-form").attr('data-applicant-id'),
                'noteID': $("#dialog-note-form").attr('data-note-id'),
                'noteText' : $("#note_edit_text").val()
            },
            function(data) {
                if( $("#dialog-note-form").attr('data-note-action') == 'add') {
                    var note_container = $('<div>').attr('class', 'note well ui-rounded-corners');
                    var note_actions   = $('<div>').attr('class', 'note-actions');
                    var delete_note    = $('<a>').attr('class', 'delete_note').attr('href', 'javascript:void(0);').attr('data-note-id', data.pk_i_id).html(jobboard.langs.delete_string);
                    var edit_note      = $('<a>').attr('class', 'edit_note').attr('href', 'javascript:void(0);').attr('data-note-id', data.pk_i_id).attr('data-note-text', data.s_text).html(jobboard.langs.edit_string);
                    var date_note      = $('<div>').attr('class', 'note-date').append($('<b>').html(data.day)).append($('<span>').html(data.month + '<br/>' + data.year));
                    var usename_note   = $('<div>').attr('class', 'note-username').html(data.admin_username);
                    var clear_div      = $('<div>').attr('class', 'clear');
                    var note_text      = $('<p>').attr('class', 'note_text').html(data.s_text.replace(/\n/g, '<br/>'));

                    $(note_container).append($(note_actions).append(delete_note).append(edit_note)).append(date_note).append(usename_note).append(clear_div).append(note_text);
                    $('#nots_table_div').prepend(note_container);
                    $('.empty-note').remove();
                    $(note_container).effect("highlight", {}, 500);
                } else {
                    var note = $('.delete_note[data-note-id="' + $("#dialog-note-form").attr('data-note-id') + '"]').parents('.note');
                    $(note).children('.edit_note').attr('data-note-text', data.s_text);
                    $(note).children('.note-date').empty().append($('<b>').html(data.day)).append($('<span>').html(data.month + '<br/>' + data.year));
                    $(note).children('.note-username').html(data.admin_username);
                    $(note).children('.note_text').html(data.s_text);
                    $(note).effect("highlight", {}, 500);
                }
                $('#dialog-note-form').dialog('close');
            },
            'json'
        );
    });
    // /notes

    $("#dialog-applicant-email").dialog({
        autoOpen: false,
        modal: true
    });
    $("#applicant-status-submit").click(function() {
        $.post(jobboard.ajax.applicant_status_notification,
            {
                "applicantID" : $('#applicant_status').attr('data-applicant-id'),
                "message" : tinyMCE.activeEditor.getContent(),
                "subject" : $("#applicant-status-notification-subject").val()
            },
            function(data){},
            'json'
        );
        $.post(jobboard.ajax.applicant_save_notification,
            {
                "applicantID" : $('#applicant_status').attr('data-applicant-id'),
                "message" : tinyMCE.activeEditor.getContent(),
                "subject" : $("#applicant-status-notification-subject").val()
            },
            function(data){
		$('#dialog-applicant-email').dialog('close');
                $('.option-send-email').hide();
            },
            'json'
        );
    });

    $("#applicant-status-cancel").click(function() {
	$('#dialog-applicant-email').dialog('close');
        $(".option-send-email").hide();
    });

    $("#applicant_status").change(function() {
        $.post(jobboard.ajax.applicant_status,
            {
                "applicantId" : $("#applicant_status").attr('data-applicant-id'),
                "status" : $("#applicant_status option:selected").attr("value")
            },
            function(data){},
            'json'
        );
        $(".option-send-email").show();
        setIcon();
    });
    setIcon();

    $(".option-send-email").hide();
    $("#cancel-send-email").click(function(){
        $(".option-send-email").hide();
    });

    var modal_send_email = function(subject, body, title) {
        $("#applicant-status-notification-subject").val(subject);
        $("#applicant-status-notification-message").val(body);
        tinyMCE.activeEditor.setContent(body);
        $("#dialog-applicant-email").dialog({width:740, title: title}).dialog('open');
    }

    $("#send-email-status").on("click", function(event) {
        $.post(jobboard.ajax.applicant_status_message, {
                "applicantID" : $('#applicant_status').attr('data-applicant-id'),
                "status" : $("#applicant_status option:selected").attr("value")
            },
            function(data){
                if( data.error) {
                    return false;
                }
                modal_send_email(data.subject, data.message, jobboard.langs.applicant_change_status_modal);
            },
            'json'
        );
    });

    $("#first-email, #send-email").on("click", function(event, element) {
         modal_send_email('', '', jobboard.langs.applicant_send_email_modal);
    });

    $('.auto-star').rating({
    callback: function(value, link, input){
        if( typeof value === 'undefined' ) {
        value = 0;
        }

        $.post(jobboard.ajax.rating,
        {
            "applicantId" : $("#applicant_status").attr('data-applicant-id'),
            "rating" : value
        },
        function(data){},
        'json'
        );
    }
    });

    // ajax set open answer punctuation, and refresh final score
    $('select.answer_punctuation').change(function(){

//        $(this).next().find('.select-box-label').text($(this).find('option:eq(0)').text());

    $('#jobboard-loading-container').show();

    var killerFormId = $(this).attr('data-killerform-id');
    var applicantId  = $(this).attr('data-applicant-id');
    var questionId   = $(this).attr('data-question-id');
    var punctuation  = $(this).find('option:selected').attr('value');
    $.post(jobboard.ajax.answer_punctuation,
        {
        "killerFormId" : killerFormId,
        "applicantId" : applicantId,
        "questionId"  : questionId,
        "punctuation" : punctuation
        },
        function(data){
        // recived object
        // obj.punctuation -> var punctuation
        if(data.punctuation=='reject') {
            $('select#applicant_status>option[value=2]').attr('selected', true);
            $('select#applicant_status').triggerHandler('change');
            $('#question_'+questionId+' i.score-unit').html(jobboard.langs.reject);
        } else  if(data.punctuation != '') {
            $('#question_'+questionId+' i.score-unit').html(punctuation);
        } else {
            $('#question_'+questionId+' i.score-unit').html('?');
        }

        // update killer form score
        var temp_score = 0;
        var is_rejected = 0;
        $('#killer_questions_applicant i.score-unit').each(function() {
            var punctuation_aux = $(this).html();
            if(punctuation_aux!='reject' && punctuation_aux!=''){
            if( !isNaN(parseInt(punctuation_aux)) ) {
                temp_score = temp_score+parseInt(punctuation_aux);
            }
            }else if(punctuation_aux=='reject') {
            is_rejected = 1;
            }

        });
        var num_questions = $('#killer_questions_applicant select').length;
        var score = temp_score/num_questions;
        $('span#sum_punctuations').html(score);
        $('span.sum_punctuations').html(score);

        if(is_rejected==1) {
            $('#applicant_status').html(jobboard.langs.reject);
        } else {

        }
        // if(corrected)
        if(data.corrected) {
            // add corrected circle
            // TODO FER
        }
        $('#jobboard-loading-container').hide();
        },
        'json'
    );
    });

    $("#view-more-mails").click(function(){
       $(this).hide();
       $(".show-more-mails").show();
    });

    $('label.score').hover(function(){
        $(this).addClass('show-box');
    }, function(){
        $(this).removeClass('show-box');
    });
});