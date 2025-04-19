import{a as l,b as e,h as m,t as c,i as b,E as i,G as p,H as f,j as n,d as _,f as g,g as h,o as d}from"./vendor-BJuH5pbf.js";import{_ as v,a as x}from"./index-BhNpcME0.js";const w={data(){return{credentials:{username:"",password:"",rememberMe:!1},loading:!1,error:null}},methods:{login(){this.loading=!0,this.error=null,this.$store.dispatch("login",this.credentials).then(()=>{this.$router.push("/")}).catch(r=>{r.response&&r.response.data?this.error=r.response.data.message||"用户名或密码错误":this.error="登录失败，请稍后重试"}).finally(()=>{this.loading=!1})}}},y={class:"login-container"},k={class:"row justify-content-center"},M={class:"col-md-6 col-lg-5"},V={class:"card shadow-sm"},N={class:"card-body p-5"},C={key:0,class:"alert alert-danger",role:"alert"},B={class:"mb-3"},U={class:"mb-3"},j={class:"mb-3 form-check"},q={class:"d-grid gap-2"},D=["disabled"],E={key:0,class:"spinner-border spinner-border-sm me-2",role:"status","aria-hidden":"true"},K={class:"mt-4 text-center"};function L(r,s,S,T,t,a){const u=h("router-link");return d(),l("div",y,[e("div",k,[e("div",M,[e("div",V,[e("div",N,[s[9]||(s[9]=e("div",{class:"text-center mb-4"},[e("img",{src:x,alt:"NoteKeeper Logo",style:{width:"60px"},class:"mb-3"}),e("h2",{class:"mb-1"},"欢迎使用 NoteKeeper"),e("p",{class:"text-muted"},"请登录以继续使用")],-1)),t.error?(d(),l("div",C,c(t.error),1)):m("",!0),e("form",{onSubmit:s[3]||(s[3]=b((...o)=>a.login&&a.login(...o),["prevent"]))},[e("div",B,[s[4]||(s[4]=e("label",{for:"username",class:"form-label"},"用户名",-1)),i(e("input",{type:"text",class:"form-control",id:"username","onUpdate:modelValue":s[0]||(s[0]=o=>t.credentials.username=o),required:"",autofocus:""},null,512),[[p,t.credentials.username]])]),e("div",U,[s[5]||(s[5]=e("label",{for:"password",class:"form-label"},"密码",-1)),i(e("input",{type:"password",class:"form-control",id:"password","onUpdate:modelValue":s[1]||(s[1]=o=>t.credentials.password=o),required:""},null,512),[[p,t.credentials.password]])]),e("div",j,[i(e("input",{type:"checkbox",class:"form-check-input",id:"rememberMe","onUpdate:modelValue":s[2]||(s[2]=o=>t.credentials.rememberMe=o)},null,512),[[f,t.credentials.rememberMe]]),s[6]||(s[6]=e("label",{class:"form-check-label",for:"rememberMe"},"记住我",-1))]),e("div",q,[e("button",{type:"submit",class:"btn btn-primary",disabled:t.loading},[t.loading?(d(),l("span",E)):m("",!0),n(" "+c(t.loading?"登录中...":"登录"),1)],8,D)])],32),e("div",K,[e("p",null,[s[8]||(s[8]=n("还没有账号? ")),_(u,{to:"/register"},{default:g(()=>s[7]||(s[7]=[n("立即注册")])),_:1})])])])])])])])}const I=v(w,[["render",L],["__scopeId","data-v-07017f21"]]);export{I as default};
