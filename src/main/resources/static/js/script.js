document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const noteForm = document.getElementById('noteForm');
    const notesContainer = document.getElementById('notesContainer');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const editNoteForm = document.getElementById('editNoteForm');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const addNoteModal = new bootstrap.Modal(document.getElementById('addNoteModal'));

    // 添加回到顶部按钮
    const scrollToTopBtn = document.createElement('div');
    scrollToTopBtn.id = 'scrollToTop';
    scrollToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    document.body.appendChild(scrollToTopBtn);

    // 监听滚动事件，显示/隐藏回到顶部按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // 点击回到顶部按钮
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 加载所有便签
    loadNotes();

    // 初始化富文本编辑器
    initTinyMCE();

    // 监听模态框事件，确保编辑器正确初始化
    document.getElementById('addNoteModal').addEventListener('shown.bs.modal', function() {
        const editor = tinymce.get('content');
        if (editor) {
            editor.setContent('');
        }
    });

    // 监听编辑便签模态框的隐藏事件，确保下次打开时不会显示旧内容
    document.getElementById('editNoteModal').addEventListener('hidden.bs.modal', function() {
        const editor = tinymce.get('editContent');
        if (editor) {
            editor.setContent('');
        }
    });

    // 提交表单添加新便签
    noteForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const newNote = {
            title: document.getElementById('title').value,
            content: tinymce.get('content').getContent(), // 获取富文本内容
            color: document.getElementById('color').value,
            isPinned: document.getElementById('isPinned').checked
        };

        // 发送POST请求添加便签
        fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newNote)
        })
            .then(response => response.json())
            .then(note => {
                // 添加成功后关闭模态框
                addNoteModal.hide();
                // 重新加载便签列表
                loadNotes();
                // 重置表单
                noteForm.reset();
                document.getElementById('color').value = '#fff8eb';

                // 显示成功提示
                showToast('便签已成功添加！', 'success');
            })
            .catch(error => {
                console.error('添加便签失败:', error);
                showToast('添加便签失败，请重试!', 'danger');
            });
    });

    // 搜索便签
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();

        if (searchTerm) {
            fetch(`/api/notes/search?query=${encodeURIComponent(searchTerm)}`)
                .then(response => response.json())
                .then(notes => {
                    renderNotes(notes);
                })
                .catch(error => {
                    console.error('搜索便签失败:', error);
                    showToast('搜索失败，请重试!', 'danger');
                });
        } else {
            loadNotes(); // 如果搜索框为空，显示所有便签
        }
    });

    // 搜索框按回车也触发搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // 保存编辑的便签
    saveEditBtn.addEventListener('click', function() {
        const noteId = document.getElementById('editNoteId').value;

        const updatedNote = {
            title: document.getElementById('editTitle').value,
            content: tinymce.get('editContent').getContent(), // 获取富文本内容
            color: document.getElementById('editColor').value,
            isPinned: document.getElementById('editIsPinned').checked
        };

        fetch(`/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedNote)
        })
            .then(response => response.json())
            .then(note => {
                // 关闭模态框
                const modal = bootstrap.Modal.getInstance(document.getElementById('editNoteModal'));
                modal.hide();

                // 重新加载便签列表
                loadNotes();

                // 显示成功提示
                showToast('便签已成功更新！', 'success');
            })
            .catch(error => {
                console.error('更新便签失败:', error);
                showToast('更新便签失败，请重试!', 'danger');
            });
    });

    // 加载所有便签的函数
    function loadNotes() {
        fetch('/api/notes')
            .then(response => response.json())
            .then(notes => {
                renderNotes(notes);
            })
            .catch(error => {
                console.error('获取便签失败:', error);
                showToast('获取便签失败，请刷新页面重试!', 'danger');
            });
    }

    // 渲染便签列表
    function renderNotes(notes) {
        notesContainer.innerHTML = '';

        if (notes.length === 0) {
            notesContainer.innerHTML = `
                <div class="col-12">
                    <div class="empty-state">
                        <i class="bi bi-sticky"></i>
                        <h4>还没有便签</h4>
                        <p>创建你的第一个便签吧！</p>
                    </div>
                </div>
            `;
            return;
        }

        // 遍历便签数据并创建便签卡片
        notes.forEach((note, index) => {
            // 使便签排列错开显示的动画延迟
            const delay = index * 0.1;

            // 创建便签卡片元素
            const noteCard = document.createElement('div');
            noteCard.className = 'col';
            noteCard.style.animationDelay = `${delay}s`;

            // 格式化日期
            const updatedAt = new Date(note.updatedAt);
            const formattedDate = updatedAt.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            // 设置卡片内容
            noteCard.innerHTML = `
                <div class="card note-card shadow-sm h-100" style="background-color: ${note.color}; border-top-color: ${getDarkerColor(note.color)}">
                    ${note.isPinned ? '<span class="pinned-badge"><i class="bi bi-pin-angle-fill"></i> 置顶</span>' : ''}
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${escapeHtml(note.title)}</h5>
                        <p class="note-time">更新于: ${formattedDate}</p>
                        <div class="card-text note-content" data-expanded="false">
                            ${note.content}
                            <div class="expand-indicator">
                                <i class="bi bi-chevron-down"></i>
                                <span>点击展开</span>
                            </div>
                        </div>
                        <div class="note-actions">
                            <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${note.id}" title="编辑">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-warning pin-btn" data-id="${note.id}" title="${note.isPinned ? '取消置顶' : '置顶'}">
                                <i class="bi bi-${note.isPinned ? 'pin-angle-fill' : 'pin-angle'}"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${note.id}" title="删除">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            notesContainer.appendChild(noteCard);
        });

        // 为所有编辑按钮添加事件监听
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const noteId = this.getAttribute('data-id');
                openEditModal(noteId);
            });
        });

        // 为所有置顶/取消置顶按钮添加事件监听
        document.querySelectorAll('.pin-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const noteId = this.getAttribute('data-id');
                togglePinStatus(noteId);
            });
        });

        // 为所有删除按钮添加事件监听
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const noteId = this.getAttribute('data-id');
                if (confirm('确定要删除这个便签吗？')) {
                    deleteNote(noteId);
                }
            });
        });

        // 为便签内容添加点击展开/收起功能
        document.querySelectorAll('.note-content').forEach(content => {
            content.addEventListener('click', function(e) {
                // 防止点击事件触发到按钮
                if (e.target.closest('.note-actions')) return;
                
                const isExpanded = this.getAttribute('data-expanded') === 'true';
                const expandIndicator = this.querySelector('.expand-indicator');
                
                if (isExpanded) {
                    this.setAttribute('data-expanded', 'false');
                    this.style.maxHeight = '150px'; // 恢复默认高度
                    expandIndicator.innerHTML = '<i class="bi bi-chevron-down"></i><span>点击展开</span>';
                } else {
                    this.setAttribute('data-expanded', 'true');
                    this.style.maxHeight = 'none';
                    expandIndicator.innerHTML = '<i class="bi bi-chevron-up"></i><span>点击收起</span>';
                }
            });
            
            // 检查内容是否需要展开按钮
            const checkOverflow = () => {
                const isOverflowing = content.scrollHeight > content.clientHeight;
                const expandIndicator = content.querySelector('.expand-indicator');
                if (expandIndicator) {
                    expandIndicator.style.display = isOverflowing ? 'flex' : 'none';
                }
            };
            
            // 在内容加载完成后检查
            setTimeout(checkOverflow, 100);
        });
    }

    // 打开编辑模态框
    function openEditModal(noteId) {
        fetch(`/api/notes/${noteId}`)
            .then(response => response.json())
            .then(note => {
                document.getElementById('editNoteId').value = note.id;
                document.getElementById('editTitle').value = note.title;
                document.getElementById('editColor').value = note.color;
                document.getElementById('editIsPinned').checked = note.isPinned;

                // 确保编辑器已经初始化完成后再设置内容
                const editor = tinymce.get('editContent');
                if (editor) {
                    editor.setContent(note.content);
                } else {
                    // 如果编辑器还未初始化，等待初始化完成后设置内容
                    tinymce.init({
                        selector: '#editContent',
                        setup: function(editor) {
                            editor.on('init', function() {
                                editor.setContent(note.content);
                            });
                        }
                    });
                }

                const editModal = new bootstrap.Modal(document.getElementById('editNoteModal'));
                editModal.show();
            })
            .catch(error => {
                console.error('获取便签详情失败:', error);
                showToast('获取便签详情失败，请重试!', 'danger');
            });
    }

    // 切换置顶状态
    function togglePinStatus(noteId) {
        fetch(`/api/notes/${noteId}/toggle-pin`, {
            method: 'PUT'
        })
            .then(response => response.json())
            .then(note => {
                loadNotes(); // 重新加载便签列表
                showToast(`便签已${note.isPinned ? '置顶' : '取消置顶'}！`, 'info');
            })
            .catch(error => {
                console.error('更新置顶状态失败:', error);
                showToast('操作失败，请重试!', 'danger');
            });
    }

    // 删除便签
    function deleteNote(noteId) {
        fetch(`/api/notes/${noteId}`, {
            method: 'DELETE'
        })
            .then(() => {
                loadNotes(); // 重新加载便签列表
                showToast('便签已成功删除！', 'success');
            })
            .catch(error => {
                console.error('删除便签失败:', error);
                showToast('删除失败，请重试!', 'danger');
            });
    }

    // 显示提示消息
    function showToast(message, type) {
        // 创建toast元素
        const toastContainer = document.createElement('div');
        toastContainer.className = 'position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '1070';

        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');

        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        toastContainer.appendChild(toastEl);
        document.body.appendChild(toastContainer);

        // 初始化并显示toast
        const toast = new bootstrap.Toast(toastEl, {
            autohide: true,
            delay: 3000
        });
        toast.show();

        // Toast消失后移除元素
        toastEl.addEventListener('hidden.bs.toast', function() {
            document.body.removeChild(toastContainer);
        });
    }

    // 获取更深的颜色（用于边框）
    function getDarkerColor(hexColor) {
        // 如果是默认白色，返回浅灰色
        if (hexColor === '#ffffff') {
            return '#cccccc';
        }

        // 将十六进制颜色转换为RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);

        // 将每个颜色通道减少30%
        const darkerR = Math.floor(r * 0.7);
        const darkerG = Math.floor(g * 0.7);
        const darkerB = Math.floor(b * 0.7);

        // 转换回十六进制格式
        return `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
    }

    // HTML转义函数，防止XSS攻击
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});

// 初始化富文本编辑器
function initTinyMCE() {
    tinymce.init({
        selector: '.tinymce-editor',
        height: 300,
        menubar: false,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
        content_style: `
            body { 
                font-family: 'LXGW WenKai Mono Screen', system-ui, -apple-system; 
                font-size: 14px; 
                line-height: 1.5; 
                padding: 10px;
                background-color: ${getComputedStyle(document.documentElement).getPropertyValue('--color-background')}
            }
        `,
        language: 'zh_CN',
        paste_data_images: true,
        // 禁用自动保存功能，避免内容混淆
        autosave_ask_before_unload: false,
        autosave_interval: '0s',
        autosave_restore_when_empty: false,
        // 设置初始化回调
        init_instance_callback: function(editor) {
            editor.on('BeforeSetContent', function(e) {
                // 清除可能存在的草稿内容
                localStorage.removeItem('tinymce-autosave-' + editor.id);
            });
        }
    });
}