$(document).ready(function() {
    var IS_FACEBOOK = false;
    var API_URL = 'https://jsonplaceholder.typicode.com/posts'; // CHANGE THIS URL FOR CLICKBAIT API

    var facebook_link_post_container = '._6m2._1zpr.clearfix._dcs';
    var facebook_link_post_container_link = 'a._52c6';
    var facebook_link_post_container_text = '._6m7._3bt9';
    var facebook_link_post_container_title = '.mbs._6m6._2cnj._5s6c';
    var facebook_link_post_container_base_url_div = '._59tj._2iau';
    var clickbait_marker_container_fb = '._5pbx.userContent';

    var checked_link_tag = 'clickbait_checker_checked';
    var checked_link_tag_is_clickbait = 'checked_link_tag_is_clickbait';
    var checked_link_tag_not_clickbait = 'checked_link_tag_not_clickbait';
    var clickbaitCount = 0;

    var dummyData = {
        "data": {
            "decision": "__label__clickbait",
            "matched_ngram": [],
            "similarity": "0.165647",
            "summary": "David BerkowitzLook, it\u2019s not a good idea to go around defending serial killers all willy-nilly, but David Berkowitz (a.k.a.\nRobert HansenIf you could just take a second and look past all the murder, abduction, and \u201chuman hunting\u201d that notorious Alaskan serial killer Robert Hansen did, you\u2019d see that he really did have some good stuff going on under the surface.\nSure, if there were a less grisly way to create an eternal army of servants, we\u2019re sure the Zodiac Killer would have done it, but when it comes to achieving eternal paradise after death, we all know it doesn\u2019t make sense to take any chances.\nSure, that doesn\u2019t exactly look good when you\u2019re on trial for manslaughter, but from a female perspective, that\u2019s some serious girl power, especially considering she did all that way back in the early \u201990s.5.\nSo, really, in a way, it\u2019s a testament to his strong will that he didn\u2019t end up killing more than the mere 30 people he murdered in the \u201970s."
        }
    }

    var _getClickbaitLabelId = function(count) {
        return 'clickbaitLabel_' + count;
    };
    var _getClickbaitPopupId = function(count) {
        return 'clickbaitPopup_' + count;
    };
    var _getClickbaitWrapperId = function(count) {
        return 'clickbaitMarkerWrapper_' + count;
    };

    var _getClickbaitInfoElement = function(data, id) {
        var element = $("<div class='clickbait-marker-info-wrapper'></div>");
        element.attr('id', _getClickbaitPopupId(id));

        var str = '';
        if (data.matched_ngram && data.matched_ngram.length > 0) {
            str += '<b>matched_ngram:</b>&nbsp;' + data.matched_ngram + "<br/>";
        }

        str += '<b>similarity:</b>&nbsp;' + data.similarity + "<br/>" + "<hr/>" +
            '<b>summary:</b><br/>' + data.summary;

        var info = $('<div></div>').html(str);
        element.append(info);

        return element;
    }

    // Function to append the circle checkmark or cross for a specific node
    var _handleClickbaitApiSuccess = function(result, node) {
        clickbaitCount = clickbaitCount + 1;

        var isClickbait = result.decision === '__label__clickbait';
        var clickbaitMarker = $("<div class='clickbait-marker-span'></div>");
        clickbaitMarker.attr('id', _getClickbaitLabelId(clickbaitCount));

        if (isClickbait) {
            clickbaitMarker.addClass('clickbait-marker-is-clickbait');
            clickbaitMarker.text('Potential Clickbait! - Click here to read more');
        } else {
            clickbaitMarker.addClass('clickbait-marker-not-clickbait');
            clickbaitMarker.text('Not Clickbait');
        }

        var clickbaitMarkerWrapper = $("<div class='clickbait-marker-wrapper'></div>");
        clickbaitMarkerWrapper.attr('id', _getClickbaitWrapperId(clickbaitCount));
        clickbaitMarkerWrapper.append(clickbaitMarker);

        var infoElement = _getClickbaitInfoElement(result, clickbaitCount);

        var closeButton = $("<div class='clickbait-marker-info-close-btn'>Close</div>");
        infoElement.append(closeButton);

        closeButton.click(function(e) {
            infoElement.fadeOut('medium');
        });

        infoElement.hide();
        clickbaitMarkerWrapper.append(infoElement);
        node.before(clickbaitMarkerWrapper);

        clickbaitMarker.click(function(e) {
            infoElement.fadeIn('medium');
        });
    };

    // Function to prepare API call and handle response
    var _callClickbaitApi = function(title, text, linkUrl, node) {
        var data = {
            title: title,
            text: text,
            url: linkUrl
        };

        $.post(API_URL, data)
            .done(function onSuccess(result) {
                _handleClickbaitApiSuccess(dummyData.data, node);
            })
            .fail(function onError(xhr, status, error) {
                console.log(error);
            })
    };

    var _getOriginalLinkFromFacebookLink = function(link) {
        var matchBegin = "php?u=";
        return link.substring(link.lastIndexOf(matchBegin) + matchBegin.length, link.lastIndexOf("&h="));
    }

    // Function to search Facebook and find all the links
    var loop = function() {
        $(facebook_link_post_container).each(function(obj) {
            var nodeObj = $(this);

            // if node has already been checked
            if (nodeObj.hasClass(checked_link_tag)) return;

            // add node checked class
            nodeObj.addClass(checked_link_tag);

            var linkObj = nodeObj.find(facebook_link_post_container_link);
            linkObj.mouseenter();

            var link = linkObj.attr('href')
            if (!link) return;

            try {
                link = _getOriginalLinkFromFacebookLink(link);
                link = decodeURIComponent(link);
            } catch (err) {
                return;
            }

            if (!link) return;

            var text = nodeObj.find(facebook_link_post_container_text).text();
            var title = nodeObj.find(facebook_link_post_container_title).text();

            // console.log('-');
            // console.log('--------link found---------');
            console.log('link', link);
            // console.log('text', text);
            // console.log('title', title);
            linkObj.mouseleave();
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