const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 宽度、高度、mode 可传
 */
function getImageShape(image_url, image_width, image_height, image_model, image_type = 2) {
    if (!image_url) {
      return '';
    }

    if (image_width && image_height) {
      if (image_url.indexOf('{width}') > 0) {
          return image_url.replace(/{mode}/g, parseInt(image_model)).replace(/{width}/g, parseInt(image_width)).replace(/{height}/g, parseInt(image_height));
      } else {
          return image_url + '?imageView2/' + parseInt(image_model, 10) + '/w/' + parseInt(image_width, 10) + '/h/' + parseInt(image_height, 10)
      }
    } else {
      return image_url.replace(/&imageView\/{mode}\/w\/{width}\/h\/{height}|\?imageView\/{mode}\/w\/{width}\/h\/{height}/g, '');
    }
}

module.exports = {
  formatTime: formatTime,
  getImageShape
}
