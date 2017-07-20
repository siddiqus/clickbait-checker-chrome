$(document).ready(function() {
    var IS_FACEBOOK = false;
    var API_URL = 'https://jsonplaceholder.typicode.com/posts'; // CHANGE THIS URL FOR CLICKBAIT API
    var facebook_link_post_container = '._3ekx._29_4';
    var facebook_link_post_container_link = 'a._52c6';
    var facebook_link_post_container_text = '._6m7._3bt9';
    var facebook_link_post_container_title = '.mbs._6m6._2cnj._5s6c';
    var facebook_link_post_container_base_url_div = '._59tj._2iau';

    var checked_link_tag = 'clickbait_checker_checked';
    var checked_link_tag_is_clickbait = 'checked_link_tag_is_clickbait';
    var checked_link_tag_not_clickbait = 'checked_link_tag_not_clickbait';

    // Function to call the API for checking clickbait
    var _clickbaitApiCall = function(data) {
        // TODO - set the API URL from the variable above, and if necessary change the post to a get
        return $.post(API_URL, data);
    };

    // Function to append the circle checkmark or cross for a specific node
    var _appendCheckedCircleToLink = function(isClickbait, node) {
        if (isClickbait) {
            node.find(facebook_link_post_container_base_url_div).append("<div class='clickbait-checker-checked-symbol clickbait-checker-checked-is-clickbait'>Potential Clickbait</div>");
        } else {
            node.find(facebook_link_post_container_base_url_div).append("<div class='clickbait-checker-checked-symbol clickbait-checker-checked-not-clickbait'>Not Clickbait</div>");
        }
    };

    // Function that uses response from clickbait API and determines if it is clickbait
    var _getIsClickbaitFromResult = function(result) {
        // TODO LOGIC - set isClickbait to true or false depending on api response

        var isClickbait = Math.random() >= 0.5; // random true or false
        return isClickbait;
    };

    // Function to prepare API call and handle response
    var _callClickbaitApi = function(title, text, linkUrl, node) {
        var data = {
            title: title,
            text: text,
            url: linkUrl
        }
        _clickbaitApiCall(data)
            .done(function onSuccess(result) {
                var isClickbait = _getIsClickbaitFromResult(result);
                _appendCheckedCircleToLink(isClickbait, node);
            })
            .fail(function onError(xhr, status, error) {
                console.log(error);
            })
    };

    // Function to search Facebook and find all the links
    var loop = function() {
        $(facebook_link_post_container).each(function(obj) {
            var nodeObj = $(this);

            // if node has already been checked
            if (nodeObj.hasClass(checked_link_tag)) return;

            // add node checked class
            nodeObj.addClass(checked_link_tag);

            var link = nodeObj.find(facebook_link_post_container_link).attr('href');
            if (!link) return;

            var text = nodeObj.find(facebook_link_post_container_text).text();
            var title = nodeObj.find(facebook_link_post_container_title).text();

            // console.log('-');
            // console.log('--------link found---------');
            // console.log('link', link);
            // console.log('text', text);
            // console.log('title', title);
            _callClickbaitApi(title, text, link, nodeObj);
        });
    };

    (function init() {
        if (document.URL.match("http(s|):\/\/(www.|)facebook")) {
            IS_FACEBOOK = true;
        }

        if (IS_FACEBOOK) {
            console.log("Clickbait Checker Active on Facebook");
            document.onscroll = loop;
            loop();
        }
    })();
});