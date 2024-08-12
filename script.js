body, html {
    height: 100%;
    margin: 0;
    padding: 0;
}

#map {
    height: 100vh;
    width: 100vw;
}

.line {
    position: absolute;
    background-color: #ff0000;
    z-index: 1000;
    animation-timing-function: ease-in-out;
}

#line-vertical, #line-horizontal, #line-vertical-bottom, #line-horizontal-right {
    width: 1px;
    height: 1px;
}

#line-vertical {
    height: 100%;
    left: 50%;
    top: 0;
    animation: lineMoveVertical 3s linear forwards, stayVisible 3s linear 3s forwards;
}

#line-horizontal {
    width: 100%;
    top: 50%;
    left: 0;
    animation: lineMoveHorizontal 3s linear forwards, stayVisible 3s linear 3s forwards;
}

#line-vertical-bottom {
    height: 100%;
    left: 50%;
    bottom: 0;
    animation: lineMoveVerticalBottom 3s linear forwards, stayVisible 3s linear 3s forwards;
}

#line-horizontal-right {
    width: 100%;
    top: 50%;
    right: 0;
    animation: lineMoveHorizontalRight 3s linear forwards, stayVisible 3s linear 3s forwards;
}

#ip-info {
    position: absolute;
    top: 50%;
    left: calc(50% - 1px);
    transform: translate(-50%, -50%);
    padding: 0px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 15px;
    animation: blink 1s infinite;
    z-index: 1001;
    user-select: none;
}

@keyframes lineMoveVertical {
    from { left: 0; }
    to { left: 50%; }
}

@keyframes lineMoveHorizontal {
    from { top: 0; }
    to { top: 50%; }
}

@keyframes lineMoveVerticalBottom {
    from { left: 100%; }
    to { left: 50%; }
}

@keyframes lineMoveHorizontalRight {
    from { top: 100%; }
    to { top: 50%; }
}

@keyframes stayVisible {
    from { opacity: 1; }
    to { opacity: 1; }
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}

.dot {
    animation: blink 1s infinite;
}

* {
    cursor: default;
}
