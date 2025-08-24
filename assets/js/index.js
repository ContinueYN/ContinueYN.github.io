$(function () {
    // 暗黑模式切换功能
    const themeToggle = $('#theme-toggle');
    const themeIcon = $('.theme-icon');
    
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    function updateThemeIcon(theme) {
        themeIcon.text(theme === 'dark' ? '☀️' : '🌙');
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }
    
    themeToggle.on('click', toggleTheme);
    initTheme();
    // 动画播放时间
    const animationTime = 500;

    // 获取画布
    const container = $('.container');

    // 获取侧边栏按钮
    const lis = $('.controls li');

    // 获取 downs
    const downs = $('.down-link');

    // 网页窗口宽度
    let viewWidth = null;

    // 网页窗口高度
    let viewHeight = null;

    // 屏幕索引
    let index = 0;

    // 检测是否在滚动
    let roll = false;

    // 更新进度指示器
    const updateProgressIndicator = () => {
        $('#current-page').text(index + 1);
        $('#total-pages').text(lis.length);
    };

    // 鼠标滚动事件
    const mousewheel = (e) => {
        // 判断是否在滚动
        if (!roll) {
            roll = true;

            // 判断向上滚动还是向下滚动
            if (e.originalEvent.wheelDelta > 0 && index > 0) {
                // 向上滚动
                index--;
            } else if (e.originalEvent.wheelDelta < 0 && index < lis.length - 1) {
                // 向下滚动
                index++;
            }

            // 滚动屏幕
            rollScenes();
        }
    }

    // 键盘导航事件
    const keydownHandler = (e) => {
        if (e.key === 'ArrowDown' && index < lis.length - 1 && !roll) {
            e.preventDefault();
            roll = true;
            index++;
            rollScenes();
        } else if (e.key === 'ArrowUp' && index > 0 && !roll) {
            e.preventDefault();
            roll = true;
            index--;
            rollScenes();
        }
    }

    // 触摸事件支持
    let touchStartY = 0;
    const touchStartHandler = (e) => {
        touchStartY = e.touches[0].clientY;
    }

    const touchEndHandler = (e) => {
        if (!roll) {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > 50) {
                roll = true;
                if (diff > 0 && index < lis.length - 1) {
                    index++;
                } else if (diff < 0 && index > 0) {
                    index--;
                }
                rollScenes();
            }
        }
    }

    // 添加事件监听
    $(document).on('mousewheel', mousewheel);
    $(document).on('keydown', keydownHandler);
    $(document).on('touchstart', touchStartHandler);
    $(document).on('touchend', touchEndHandler);

    // 滚动视图
    const rollScenes = () => {
        // 更新进度指示器
        updateProgressIndicator();

        // 添加动画
        if (index == 1) {
            $('.skill-pane').addClass('skill-animation');
        }
        if (index == 2) {
            $('.time-ul').addClass('time-line-animation');
        }
        if (index == 3) {
        // 移除动画类再重新添加，触发重新动画
        $('.hobby-card').removeClass('animated');
        setTimeout(() => {
            $('.hobby-card').addClass('animated');
        }, 50);
    }

        // 获取屏幕宽度
        viewWidth = $(document).width();

        // 获取屏幕高度
        viewHeight = $(document).height();

        // 添加动画
        container.addClass("container-animation");

        // 更改位置
        container.css('top', -index * viewHeight + 'px');

        // 更改侧边栏样式
        changeLocation(index);

        // 更改状态
        setTimeout(function () {
            roll = false;
            container.removeClass("container-animation");

            // 删除动画
            if (index != 1) {
                $('.skill-pane').removeClass('skill-animation');
            }
            if (index != 2) {
                $('.time-ul').removeClass('time-line-animation');
            }
            if (index != 3) {
                $('.hobby-card').removeClass('animated');
            }
        }, animationTime);
    };

    //绑定点击事件
    for (let i = 0; i < lis.length; i++) {
        // 给每个 li 添加点击事件
        lis[i].onclick = function () {
            // 判断是否在滚动
            if (!roll) {
                roll = true;
                // 这里的 index 等于 li 的下标
                index = i;
                rollScenes();
            }
        }
    }

    // 绑定点击事件
    for (let i = 0; i < downs.length; i++) {
        downs[i].onclick = function () {
            // 判断是否在滚动
            if (!roll) {
                roll = true;
                // 这里的 index 等于 li 的下标
                index = i + 1;
                rollScenes();
            }
        }
    }

    //修改 bar 位置
    function changeLocation(index) {
        $(".controls .bar").css('transform', 'translateY(' + index * 49 + 'px)');
    }

    // 窗体改动事件
    const getWindowInfo = () => {
        // 获取屏幕宽度
        viewWidth = $(document).width();

        // 获取屏幕高度
        viewHeight = $(document).height();

        // 更改位置
        container.css('top', -index * viewHeight + 'px');

        // 屏幕块
        const section = $(".section");

        // 设置样式
        for (let i = 0; i < section.length; i++) {
            section[i].setAttribute("style", "width: " + document.body.clientWidth + "px; height: " + document.body.clientHeight + "px");
        }
    };

    // 添加窗体改动事件
    $(window).on('resize', getWindowInfo);

    // 初始化进度指示器
    updateProgressIndicator();
});