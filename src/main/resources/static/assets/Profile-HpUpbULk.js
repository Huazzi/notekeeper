import{_ as h,m as v}from"./index-BhNpcME0.js";import{a as i,b as e,h as n,t as m,j as c,i as b,E as f,G as p,o}from"./vendor-BJuH5pbf.js";const _={name:"Profile",data(){return{form:{email:"",fullName:""},avatarFile:null,avatarPreview:null,loading:!1,error:null,success:null}},computed:{...v(["user"])},created(){this.user&&(this.form.email=this.user.email||"",this.form.fullName=this.user.fullName||"")},methods:{updateProfile(){this.loading=!0,this.error=null,this.success=null,this.$store.dispatch("updateProfile",this.form).then(()=>{this.success="个人资料更新成功！"}).catch(a=>{a.response&&a.response.data?this.error=a.response.data.message||"更新失败，请重试":this.error="服务器错误，请稍后再试"}).finally(()=>{this.loading=!1})},onFileChange(a){const s=a.target.files[0];if(!s)return;if(!s.type.match("image.*")){this.error="请选择图片文件";return}if(s.size>5*1024*1024){this.error="图片大小不能超过5MB";return}this.avatarFile=s;const d=new FileReader;d.onload=u=>{this.avatarPreview=u.target.result},d.readAsDataURL(s)},uploadAvatar(){if(!this.avatarFile){this.error="请先选择一张图片";return}this.loading=!0,this.error=null,this.success=null;const a=new FormData;a.append("avatar",this.avatarFile),this.$store.dispatch("updateAvatar",a).then(s=>{this.success="头像更新成功！",this.avatarFile=null,this.avatarPreview=null,document.getElementById("avatarInput").value=""}).catch(s=>{s.response&&s.response.data?this.error=s.response.data.message||"上传失败，请重试":this.error="服务器错误，请稍后再试"}).finally(()=>{this.loading=!1})}}},g={class:"profile-container"},y={class:"row"},w={class:"col-md-10 mx-auto"},F={class:"card shadow-sm"},N={class:"card-body p-4"},P={key:0,class:"alert alert-danger",role:"alert"},k={key:1,class:"alert alert-success",role:"alert"},x={class:"row"},C={class:"col-md-4 mb-4 mb-md-0"},A={class:"text-center"},B={class:"avatar-container mb-3"},D=["src"],V={class:"mb-3"},I=["disabled"],E={key:0,class:"spinner-border spinner-border-sm me-2",role:"status","aria-hidden":"true"},M={class:"col-md-8"},U={class:"mb-3"},j=["value"],G={class:"mb-3"},R={class:"mb-3"},S=["disabled"],T={key:0,class:"spinner-border spinner-border-sm me-2",role:"status","aria-hidden":"true"};function q(a,s,d,u,t,l){return o(),i("div",g,[e("div",y,[e("div",w,[e("div",F,[e("div",N,[s[11]||(s[11]=e("h2",{class:"mb-4"},"个人资料",-1)),t.error?(o(),i("div",P,m(t.error),1)):n("",!0),t.success?(o(),i("div",k,m(t.success),1)):n("",!0),e("div",x,[e("div",C,[e("div",A,[e("div",B,[e("img",{src:t.avatarPreview||a.user&&a.user.avatar||"/assets/default-avatar.jpg",alt:"用户头像",class:"avatar-img rounded-circle img-thumbnail"},null,8,D)]),e("div",V,[e("input",{type:"file",class:"form-control",id:"avatarInput",accept:"image/*",onChange:s[0]||(s[0]=(...r)=>l.onFileChange&&l.onFileChange(...r))},null,32)]),e("button",{type:"button",class:"btn btn-primary",disabled:t.loading||!t.avatarFile,onClick:s[1]||(s[1]=(...r)=>l.uploadAvatar&&l.uploadAvatar(...r))},[t.loading?(o(),i("span",E)):n("",!0),s[5]||(s[5]=c(" 更新头像 "))],8,I)])]),e("div",M,[e("form",{onSubmit:s[4]||(s[4]=b((...r)=>l.updateProfile&&l.updateProfile(...r),["prevent"]))},[e("div",U,[s[6]||(s[6]=e("label",{for:"username",class:"form-label"},"用户名",-1)),e("input",{type:"text",class:"form-control",id:"username",value:a.user&&a.user.username,disabled:""},null,8,j),s[7]||(s[7]=e("small",{class:"text-muted"},"用户名不可更改",-1))]),e("div",G,[s[8]||(s[8]=e("label",{for:"email",class:"form-label"},"邮箱",-1)),f(e("input",{type:"email",class:"form-control",id:"email","onUpdate:modelValue":s[2]||(s[2]=r=>t.form.email=r),required:""},null,512),[[p,t.form.email]])]),e("div",R,[s[9]||(s[9]=e("label",{for:"fullName",class:"form-label"},"姓名",-1)),f(e("input",{type:"text",class:"form-control",id:"fullName","onUpdate:modelValue":s[3]||(s[3]=r=>t.form.fullName=r)},null,512),[[p,t.form.fullName]])]),e("button",{type:"submit",class:"btn btn-success",disabled:t.loading},[t.loading?(o(),i("span",T)):n("",!0),s[10]||(s[10]=c(" 保存更改 "))],8,S)],32)])])])])])])])}const H=h(_,[["render",q],["__scopeId","data-v-d3a02d68"]]);export{H as default};
