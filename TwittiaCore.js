function Twittia() {
	this.body = document.getElementById("body");
	this.max_length = 100;
	this.since_id;
	this.getNewData();
	this.timeout = 2 * 60 * 1000;
}

Twittia.prototype.newStatus = function(status, supress_new_with_timeout) {
	if(status != null) {
		for(var i = status.length-1, c=0; i>=c; --i) {
			if(this.body.childNodes.length > 0) {
				if(this.body.childNodes.length > this.max_length) {
					this.body.removeChild(this.body.lastChild);
				}
				this.body.insertBefore(this.getItem(status[i]),	this.body.firstChild);
			} else {
				this.body.appendChild(this.getItem(status[i]));
			}
		}
	}
	
	if(!supress_new_with_timeout) {
		var _this = this;
		setTimeout(function() { _this.getNewData() }, this.timeout);
	}
}

Twittia.prototype.getItem = function(status) {
	var _this = this;
	this.since_id = status.id;

	if(status.retweeted_status != null) {
		var original_status = status;
		var status = status.retweeted_status;
	}

	var template = this.getTemplate();
	template.reply_to.onclick = function() { replyTo(status.user.screen_name, status.id); return false; }
	template.retweet.onclick = function() { template.retweet.className = "hidden"; _this.retweet(status.id, template.item); return false; }
	
	template.image.style.backgroundImage = "url(" + status.user.profile_image_url + ")";
	template.username.innerText = status.user.screen_name;
	template.username.href = "http://twitter.com/" + status.user.screen_name
	
	if(original_status != null) {
		var retweeted = document.createElement("span")
		retweeted.className = "retweeted";
		var retweeted_icon = document.createElement("span");
		retweeted_icon.innerText = " ";
		retweeted.appendChild(retweeted_icon);
		var retweeted_by = document.createElement("a");
		retweeted_by.innerText = original_status.user.screen_name + " ";
		retweeted_by.href = "http://twitter.com/" + original_status.user.screen_name;
		retweeted.appendChild(document.createTextNode("@"));
		retweeted.appendChild(retweeted_by);
		template.in_reply.parentNode.parentNode.insertBefore(retweeted, template.in_reply.parent);
	}
	
	if(status.in_reply_to_screen_name != null) template.in_reply.innerText = status.in_reply_to_screen_name;
	else template.in_reply.parentNode.className = "hidden";
	template.in_reply.href = "http://twitter.com/" + status.in_reply_to_screen_name + "/status/" + status.in_reply_to_status_id;

	template.message.innerHTML = replaceTwitterLinks(replaceURLWithHTMLLinks(status.text));
	
	var time = document.createElement("abbr");
	time.innerText = status.created_at;
	time.title = status.created_at;
	time.className = "timeago";
	$(time).timeago();
	template.ago.appendChild(time);
	template.ago.href = "http://twitter.com/" +  status.user.screen_name + "/status/" + status.id;
	
	template.source.innerHTML = status.source;
	
	return template.item;
}

Twittia.prototype.getTemplate = function() {

	if(this.template == "undefined") {
		return jQuery.extend(true, {}, this.template);
	}
	
	var a = document.createElement("a");
	
	var item = document.createElement("li");
	
	var reply_to = a.cloneNode();
	reply_to.className = "reply_to"
	reply_to.innerText = " ";
	reply_to.href = "#";
	item.appendChild(reply_to);
	
	var retweet = a.cloneNode();
	retweet.className = "retweet";
	retweet.innerText = " ";
	retweet.href = "#";
	item.appendChild(retweet);
	
	
	var image = document.createElement("div");
	image.className = "image";
	item.appendChild(image);
	
	var image_username = a.cloneNode();
	image.appendChild(image_username);
	
	var data = document.createElement("div");
	data.className = "data";
	item.appendChild(data);
	
	var head = document.createElement("h1");
	data.appendChild(head);
	
	var username = a.cloneNode();
	head.appendChild(username);
	
	var in_reply = document.createElement("span");
	in_reply.className = "reply";
	head.appendChild(in_reply);
	
	var in_reply_text = document.createTextNode(" in reply to ");
	in_reply.appendChild(in_reply_text)
	
	var in_reply_a = a.cloneNode();
	in_reply.appendChild(in_reply_a);
	
	var message = document.createElement("p");
	message.className = "message";
	data.appendChild(message);
	
	var date = message.cloneNode();
	date.className = "date";
	data.appendChild(date);
	
	var ago = a.cloneNode();
	date.appendChild(ago);
	
	var from = document.createTextNode(" from ");
	date.appendChild(from)
	
	var source = document.createElement("span");
	source.className = "source";
	date.appendChild(source)

	this.template = {
		item: item,
		reply_to: reply_to,
		retweet: retweet,
		image: image,
		username: username,
		in_reply: in_reply_a,
		message: message,
		ago: ago,
		source: source
	}

	return jQuery.extend(true, {}, this.template);
}

Twittia.prototype.getNewData = function(supress_new_with_timeout) {

	var url = "http://api.twitter.com/1/statuses/home_timeline.json?count=100";
	if(this.since_id) url += "&since_id=" + this.since_id;
	var _this = this;

	$.ajax({
		url: url,
		dataType: 'json',
		success: function(data) {
			_this.newStatus(data, supress_new_with_timeout);
		},
		error:function (xhr, ajaxOptions, thrownError){
			alert(xhr.status);
			alert(thrownError);
			setTimeout(function() { _this.getNewData(supress_new_with_timeout) }, this.timeout);
		}
	});
}

Twittia.prototype.sendNewTweet = function(tweet, in_reply_to_status_id) {
	
	var url = "http://api.twitter.com/1/statuses/update.json";
	var _this = this;
	var data = "source=twittia&status=" + tweet;
	if(in_reply_to_status_id != '') data += "&in_reply_to_status_id=" + in_reply_to_status_id
		
	$.ajax({
		url: url,
		type: 'POST',
		data: data,
		dataType: 'json',
		success: function(data) {
			_this.getNewData(true);
		},
		error:function (xhr, ajaxOptions, thrownError) {
			alert(xhr.status);
			alert(thrownError);				
		}
	});
}

Twittia.prototype.retweet = function(status_id, item) {
	var url = "http://api.twitter.com/1/statuses/retweet/" + status_id + ".json";
	var _this = this;
		
	$.ajax({
		url: url,
		type: 'POST',
		dataType: 'json',
		success: function(data) {
			item.parentNode.replaceChild(_this.getItem(data), item);
		},
		error:function (xhr, ajaxOptions, thrownError) {
			alert(xhr.status);
			alert(thrownError);				
		}
	});
}

function replaceURLWithHTMLLinks(text) {
	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	return text.replace(exp,"<a href='$1'>$1</a>"); 
}

function replaceTwitterLinks(text) {
	var username = /(^|\W)(@)([-A-Z0-9+_\.ÅÖÄÜ]+[^\.,;\W])/ig;
	var hash = /(^|\W)(#)([-A-Z0-9+_\.ÅÖÄÜß]+[^\.,;\W])/ig;
	text = text.replace(username, "$1$2<a href='http://twitter.com/$3'>$3</a>");
	return text.replace(hash, "$1$2<a href='http://search.twitter.com/search?q=%23$3'>$3</a>");
}

function replyTo(username, status_id) {
	controller.openNewTweetWindowInReplyTo_statusId_(username, status_id);
}

function loadPlugin(url) {
	var plugin = document.createElement("script");
	plugin.type = "text/javascript";
	plugin.src = url;
	document.getElementsByTagName("head")[0].appendChild(plugin);
}