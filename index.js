function isAbsolute(pathname) {
    return pathname.charAt(0) === '/';
}

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
        list[i] = list[k];
    }

    list.pop();
}

// This implementation is based heavily on node's url.parse
function resolvePathname(to, from) {
    if (from === undefined) from = '';

    var toParts = (to && to.split('/')) || [];
    var fromParts = (from && from.split('/')) || [];

    var isToAbs = to && isAbsolute(to);
    var isFromAbs = from && isAbsolute(from);
    // 没有明白这个的命名，isAbsolute是判断初始位置是否是 / ,
    // 为什么这个命名为 endAbs 而不是startAbs
    // 他的意思是不是这个地址最终要返回的是 abs，如果命名为 mustEndAsAbs 会不会更好一点？
    var mustEndAbs = isToAbs || isFromAbs;

    // 如果 to 是 /about，那么不管 from 是什么，结果都是 /about
    if (to && isAbsolute(to)) {
        // to is absolute
        fromParts = toParts;
    }

    // 这时候就是不管 to 第一位不是 / ，也不管 to 中有没有 . 还是 .. 都直接加载 from 的后面
    // 至于 . 和.. 后面会一起处理
    else if (toParts.length) {
        // to is relative, drop the filename
        fromParts.pop();
        fromParts = fromParts.concat(toParts);
    }

    if (!fromParts.length) return '/';

    var hasTrailingSlash;
    if (fromParts.length) {
        var last = fromParts[fromParts.length - 1];
        hasTrailingSlash = last === '.' || last === '..' || last === '';
    } else {
        hasTrailingSlash = false;
    }

    // 处理路径中的 . 和 ..
    // 这个的处理方法还是挺好的，值得学习
    var up = 0;
    for (var i = fromParts.length; i >= 0; i--) {
        var part = fromParts[i];

        if (part === '.') {
            spliceOne(fromParts, i);
        } else if (part === '..') {
            spliceOne(fromParts, i);
            // 这里每一次 up++，都会在for 循环下一次进行处理
            // 配置for循环是从最后往前循环，就能解决 . 和 .. 的问题
            up++;
        } else if (up) {
            spliceOne(fromParts, i);
            up--;
        }
    }

    // 奇怪，为什么还会有 up 存在
    // 因为在前面的 for 循环中，如果i = 0的时候，up++ 之后就没有执行之后的了
    // 这时候因为 spliceOne(fromParts, i); 所以需要在这里再加回去
    if (!mustEndAbs) for (; up--; up) fromParts.unshift('..');

    // 没有明白这一步是要干什么？
    // 明白了，这一步在路径最前面加上 '' ,然后使用 fromParts.join('/') 的时候
    // 就能把 / 加在路径的最前面了
    if (
        mustEndAbs &&
        fromParts[0] !== '' &&
        //  !fromParts[0] 如果这个是个 true 的话，都排除掉fromParts[0] !== ''了
        //  怎么还可能会有 !fromParts[0]
        (!fromParts[0] || !isAbsolute(fromParts[0]))
    )
        fromParts.unshift('');

    var result = fromParts.join('/');

    // 如果最后需要加上/，那就加
    if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

    return result;
}

export default resolvePathname;
