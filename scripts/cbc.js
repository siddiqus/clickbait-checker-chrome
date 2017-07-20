$(document).ready(function() {
    var API_URL = 'https://jsonplaceholder.typicode.com/posts'; // CHANGE THIS URL FOR CLICKBAIT API
    var facebook_link_post_container = '._3ekx._29_4';
    var facebook_link_post_container_link = 'a._52c6';
    var facebook_link_post_container_text = '._6m7._3bt9';
    var facebook_link_post_container_title = '.mbs._6m6._2cnj._5s6c';
    var checked_link_tag = 'clickbait_checker_checked';
    var checked_link_tag_is_clickbait = 'checked_link_tag_is_clickbait';
    var checked_link_tag_not_clickbait = 'checked_link_tag_not_clickbait';

    // Function to call the API for checking clickbait
    var _clickbaitApiCall = function(data) {
        // TODO - set the API URL from the variable above, and if necessary change the post to a get
        return $.post(API_URL, data);
    };

    // Function to append the circle checkmark or cross for a specific node
    var _appendCheckedCircleToLink = function(isClickbait, titleNode) {
        if (isClickbait) {
            titleNode.find('a').append("<div class='clickbait-checker-checked-symbol clickbait-checker-checked-is-clickbait'>✖</div>");
        } else {
            titleNode.find('a').append("<div class='clickbait-checker-checked-symbol clickbait-checker-checked-not-clickbait'>✓</div>");
        }
    };

    // Function to handle the response after clickbot API success
    var _handleClickbaitApiResponse = function(result, titleNode) {
        var isClickbait = result;
        // TODO LOGIC - set isClickbait to true or false depending on api response
        _appendCheckedCircleToLink(isClickbait, titleNode);
    };

    // Function to prepare API call and handle response
    var _callClickbaitApi = function(title, text, linkUrl, titleNode) {
        var data = {
            title: title,
            text: text,
            url: linkUrl
        }
        _clickbaitApiCall(data)
            .done(function(result) {
                _handleClickbaitApiResponse(result, titleNode);
            })
            .fail(function(xhr, status, error) {
                console.log(error);
            })
    };

    var loop = function() {
        $(facebook_link_post_container).each(function(obj) {
            var nodeObj = $(this);
            if (nodeObj.hasClass(checked_link_tag)) return;
            nodeObj.addClass(checked_link_tag);

            var link = nodeObj.find(facebook_link_post_container_link).attr('href');
            if (!link) return;

            var text = nodeObj.find(facebook_link_post_container_text).text();

            var titleNode = nodeObj.find(facebook_link_post_container_title);
            var title = titleNode.text();

            // console.log('-');
            // console.log('--------link found---------');
            // console.log('link', link);
            // console.log('text', text);
            // console.log('title', title);
            _callClickbaitApi(title, text, link, titleNode);
        });
    };

    (function init() {
        console.log("Clickbait Checker Active");
        document.onscroll = loop;
        loop();
    })();
});