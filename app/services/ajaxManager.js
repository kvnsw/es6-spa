// =============================
// ajaxManager service
// =============================

/**
 * @author Kevin Siow k.siow@passerelle.co
 * @module services/ajaxManager
 * @version 1.0
 * @desc Make Promisified Ajax Calls
 * @param {string} reqLink - Url of request
 * @returns {Object}
 */
export default function promisifyReq(reqLink) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: reqLink,
			dataType: 'json',
		}).done(resolve).fail(reject);
	});
}
