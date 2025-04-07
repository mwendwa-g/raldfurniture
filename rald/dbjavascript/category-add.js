const aappii = "/api/raldfurniture";
const token = localStorage.getItem("token");

window.onload = function() {
    checkUserRole();
}

function checkUserRole() {
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    const decodedToken = decodeJwt(token);
    const userRole = decodedToken.role;
    
    if (userRole === "admin") {
        return;
    } else {
        window.location.href = '../index.html';
    }
}

function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        Swal.fire({
            title: "Error!",
            text: "Failed to decode token.",
            icon: "error",
            confirmButtonText: "Try Again"
        });
        
        return null;
    }
}


const createCategory = document.getElementById('create-category')
createCategory.addEventListener("click", async function (e){
    e.preventDefault();
    const image = document.getElementById("category-image");
    const name = document.getElementById("category-name").value;
    const color = document.getElementById("category-color").value;
    const description = document.getElementById("category-description").value;
    if(!name){
        Swal.fire({
            title: "Missing Field!",
            text: "Please fill in category name",
            icon: "warning",
            confirmButtonText: "OK"
        });
    }
    const formData = new FormData();
    formData.append("image", image.files[0]);
    formData.append("name", name);
    formData.append("color", color);
    formData.append("description", description);
    try {
        const response = await fetch(`${aappii}/categories`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || "Error creating category");
        }

        Swal.fire({
            title: "Success!",
            text: "Category created",
            icon: "success",
            confirmButtonText: "OK"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });

    } catch (error) {
        Swal.fire({
            title: "Error!",
            text: "An error occurred.",
            icon: "error",
            confirmButtonText: "Try Again"
        });
        
        
    }
})


document.querySelector(".account-log-out").addEventListener("click", (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token")
    if(!token){
        return;
    }
    else if(token){
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, log me out!"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                location.reload();
            }
        });
    }
});