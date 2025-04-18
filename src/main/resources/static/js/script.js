document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const noteForm = document.getElementById('noteForm');
    const notesContainer = document.getElementById('notesContainer');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const editNoteForm = document.getElementById('editNoteForm');
    const saveEditBtn = document.getElementById('saveEditBtn');

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

    // 提交表单添加新便签
    noteForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const newNote = {
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
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
                // 添加成功后重新加载便签列表
                loadNotes();
                // 重置表单
                noteForm.reset();
                document.getElementById('color').value = '#ffffff';

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
            content: document.getElementById('editContent').value,
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
                        <p class="card-text note-content">${escapeHtml(note.content)}</p>
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
    }

    // 打开编辑模态框
    function openEditModal(noteId) {
        fetch(`/api/notes/${noteId}`)
            .then(response => response.json())
            .then(note => {
                document.getElementById('editNoteId').value = note.id;
                document.getElementById('editTitle').value = note.title;
                document.getElementById('editContent').value = note.content;
                document.getElementById('editColor').value = note.color;
                document.getElementById('editIsPinned').checked = note.isPinned;

                // 显示模态框
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