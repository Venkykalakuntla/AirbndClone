(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach((form) => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            console.log("js is workin 1");
          event.preventDefault()
          event.stopPropagation()
         
        }
        console.log("js is workin 2");

        form.classList.add('was-validated')
      }, false)
    })
  })()