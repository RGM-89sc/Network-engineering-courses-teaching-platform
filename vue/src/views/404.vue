<template>
  <div class="bigCon">
		<div class="con">
			<p class="notf">404 Not Found</p>
			<p class="mes">This is not the web page you are looking for.</p>
			<span class="reHome">
				<a href="javascript: void();">返回首页>></a>
			</span>
		</div>
	</div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
		* {
			margin: 0;
			padding: 0;
		}
		html ,
		body {
			min-width: 960px;
			width: 100%;
			height: 100%;
		}
		a {
			text-decoration: none;
			color: #fff;
		}
		.bigCon {
			width: 100%;
			height: 100%;
		}
		.con {
			padding: 8% 10% 0;
			width: 80%;
			height: 65%;
			background-color:#87CEFA;
		}
		.con > p {
			color: #fff;
		}
		.notf {
			font-size: 85px;
			font-weight: bolder;
		}
		.mes {
			margin-top: 20px;
			font-size: 38px;
		}
		.reHome {
			display: inline-block;
			border: 1px solid #fff;
			padding: 4px 8px;
			margin-top: 80px;
		}
		.reHome > a {
			font-size: 18px;
		}
</style>
