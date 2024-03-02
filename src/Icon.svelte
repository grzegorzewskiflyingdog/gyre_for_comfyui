<script>
    export let name=""
</script>
{#if name==="move"}
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFF"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    id="dragModelManagerTopBarIcon" cursor="move">
    <path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
    <path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
    <path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
    <path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
    <path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
    <path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
    </svg>
{/if}
{#if name==="down"}
    <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"  width="15" height="15"><path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z"/></svg>
{/if}
{#if name==="up"}
    <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"  width="15" height="15"><path d="M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z"/></svg>
{/if}
{#if name==="save"}
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-device-floppy" aria-hidden="true" focusable="false"><path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"></path><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M14 4l0 4l-6 0l0 -4"></path></svg>
{/if}
{#if name==="Gyre"}
     <!-- svelte-ignore a11y-missing-attribute -->
     <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAdCAMAAACKeiw+AAAC/VBMVEUAAAAfQ1FJNEQ4TVEfPFcsd5MgSGEeSlpzf5c+sMgXia8XT20vgpcmOFEdNU0YYoWjQ2pMT2oganJeLUxZN0BOSlAck/h1hqck5PZQXn0bLEQotdcUGy1H+/8UfKhAgd3qiLc81ugvyN4jd8rpWosnM01EoLFJwc3WcaNYX2Imt8h6e4ZDere3vc2ssb8fgp6ZHVhuc4Ali6JRdp2oWECJkJkJRmtCSVAoQFl4e38mdn1lZ2IkPlqkVP8Hkv8GBRAAh/88YWoNDx1K/v87+f8Bxf8Jff/hkPoNR+//c5MsUFofNkcTGCgBAAVn//9X//8x/P8b7v9a3/8azv8Dp//TgP+aTP+5Rf+wQP8Nzv4f2v2/aP3kmPw74vvJefs12vm42fkBbu7yjOiutdYFQ9Ton9MCM87sWMvuaMrjbsYCJLNUMpEKG3/7V3AfQG8tUWx0AGUnS2M0RlUnQVRvAFMnNFAcLEj/nj4WKDoTHDgWIjUUISz+ww17//828P8z7P8M5//Q5v9q3P/11P8AvP8Asf/lov//nf9Amv//bP+6Tv//Rv+iRf8NVv5H6v1Yz/3SiP2I4fxmtfzYt/vqyvgam/cAgveedve4YPaR0vVp0PRZxPRBxfKySvGhzPBAr/D/c+wHuOsDU+rklOnXaunKWenCheTRRuOTn+I8iOCUzd3lUdz/lNv/ttractq1qNkZltcBZdQXhNI/udGMxtBpqs/Ses3uhMcCYMf/4sLLY8EkYsEGPb0Se7plSbjmVbe2c7bilrUfi7P1abD/S6/rSq1tXKwoQ6z1sKSdTKT0s6Fvf6BLdZ7WZ55pZ54uhJsGHpf4UpXaopMsgpLLAJL6Y4+iAI7jRYvkAInFJoc0eob8aIMcOYJ4IoJDVoD0wX9WJH4RLHjzPnfJPnToXXBNAHCbE2wTJ2lhjmNxoGIgOWGtI2Bhil2aEVSfJFKRC1H/tUyZAEv/g0pnd0hnAEPMnzr/tif/pyb/iSCYiBT/pADmngDSmwDFkQD/jQDNN3N7AAAAPXRSTlMAGRAKk3w3Kdq/lZWNe3FnX0hDQxsV/f36+vr29vLt5+Hg2dHPy8nEw72pmpiTjIyKfXhycW1jYFpXNSQd0lS2vQAAAchJREFUKM9ioCIwUuPRssIpq+8X2yChxIhLmtMvKpCVgRm7JBu7uvOsJjYcWhmNeThdZjazYpcVZdSRXzk/PqFRiIEJizQ/l3JH/6TpSxcsE8Qiyy69d45LQG1C0uL2tSboksyMQnKbXaLmnbz7IPvY+p0qAujmcx9ydk1+9uXtu/clT/dN6dRA851ZrGvQ2Y+5Vz1vP3ldkj25W0EU1WX1rROvP8qY656U4fm44Fzb6jXCyNKsda5bcveHARY9Ic52iefNglVBmSJIsiJbgyNf/lhuG5N6IsZ23cVrB5xXCCBkrbXPTA28/CvdNvRgzalQ28NXdvnPNkC43pSjaLedw89v4bbul1LdbTNvbOuLR7Jb93Rpfprdxj8fwnui42aEHT2SvFAWyWo98cqiOx52O/7WbO+KiEj/dH9DgCKStCVHWZVjjodd4uff38vL/33dFOnPhRyohvecioHybg6Jt968OD+tJVgMJc0wSVbaezk+z+p1c3CwCwlxW4SWKsxLnXyLHfMfXshKS0nZcxwjUnkr7H2rC728CvPyXnlrYsa4RZmPva9Thbd3tY8qtuTExCJV5WRv7yPDiyM1svOxcLPw2RCfbQBuO530bO8cGwAAAABJRU5ErkJggg==">
{/if}
