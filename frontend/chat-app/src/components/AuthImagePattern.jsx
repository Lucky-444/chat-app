
// const AuthImagePattern = ({ title, subtitle }) => {
//   return (
//     <div className="hidden lg:flex items-center justify-center bg-base-200 p-10">
//       <div className="max-w-md text-center">
//         {/* Grid of glowing boxes */}
//         <div className="grid grid-cols-3 gap-5">
//           {[...Array(9)].map((_, i) => (
//             <div
//               key={i}
//               className={`aspect-square  rounded-3xl  bg-primary/10 ${
//                 i % 2 === 0 ? "animate-pulse bg-primary" : "animate-pulse bg-primary"
//               }`}
//             />
//           ))}
//         </div>

        
//         <h2 className="text-3xl font-bold mt-4 mb-6 text-base-content">{title}</h2>
//         <p className="text-base-content/60">{subtitle}</p>
//       </div>
//     </div>
//   );
// };

// export default AuthImagePattern;


const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;






